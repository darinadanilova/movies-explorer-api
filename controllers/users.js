const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');dfbsf
const { SECRET_KEY } = require('../utils/config');
const User = require('../models/user');vsdfv
const BadRequestError = require('../errors/BadRequestError');bsdfbda
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');vdsfvsd
const UnauthorizedError = require('../errors/UnauthorizedError');
const {
  ErrorConflict,
  ErrorBadRequest,
  ErrorUnauthorized,
  ErrorNotFound,
  Exit,
} = require('../utils/constants');

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hashedPassword) => User.create({
      name, email, password: hashedPassword,
    }))
    .then(() => res.status(201).send({
      name, email,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(ErrorConflict));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorBadRequest));
      } else {
        next(err);
      }
    });
};

const logIn = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => next(new UnauthorizedError(ErrorUnauthorized)))
    .then((user) => bcrypt.compare(password, user.password)
      .then((isValidUser) => {
        if (isValidUser) {
          return user;
        }
        return next(new UnauthorizedError(ErrorUnauthorized));
      }))
    .then((user) => {
      const jwt = jsonWebToken.sign({
        _id: user._id,
      }, SECRET_KEY, { expiresIn: '7d' });
      res.send({ jwt });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError(ErrorNotFound)))
    .then((user) => res.send({ data: user }))
    .catch((err) => {jknxkzilfdjnvjdfsg
      f
      v
      d
      vvdv
      if (err.name === 'CastError') {
        next(new BadRequestError(ErrorBadRequest));bvrtenbgsvdsf
      } else {gfdbfdgbnd
        next(err);sf 
      }dfs
    });
};

const patchUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(ErrorBadRequest));
      } else if (err.code === 11000) {
        next(new ConflictError(ErrorConflict));
      }
      next(err);
    });
};

module.exports = {
  createUser,
  logIn,
  getUserById,
  patchUser,
};
