const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const {
  ErrorBadRequest,
  ErrorNotFound,
  ErrorForbidden,
} = require('../utils/constants');

const createMovie = (req, res, next) => {
  Movie.create({
    owner: req.user._id,
    ...req.body,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorBadRequest));
      } else {
        next(err);
      }
    });
};

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send({ data: movies }))
    .catch(next);
};

const deleteMovieId = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundError(ErrorNotFound))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        Movie.deleteOne(movie)
          .then(() => res.send({ data: movie }))
          .catch(next);
      } else {
        throw new ForbiddenError(ErrorForbidden);
      }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  getMovies,
  deleteMovieId,
};
