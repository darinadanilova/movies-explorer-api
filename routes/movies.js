const router = require('express').Router();
const {
  createMovie, getMovies, deleteMovieId,
} = require('../controllers/movies');
const {
  validationCreateMovie,
  validationDeleteMovieId,
} = require('../utils/validation');

router.get('/', getMovies);

router.post('/', validationCreateMovie, createMovie);

router.delete('/:movieId', validationDeleteMovieId, deleteMovieId);

module.exports = router;
