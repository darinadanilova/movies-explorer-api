const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
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
      const data = {
        ...user.toJSON(),
        jwt,
      };
      console.log(data);
      res
        .cookie('jwt', jwt, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ data });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => next(new NotFoundError(ErrorNotFound)))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(ErrorBadRequest));
      } else {
        next(err);
      }
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

const logOut = (req, res) => {
  res.clearCookie('jwt').send({ message: Exit });
};

module.exports = {
  createUser,
  logIn,
  getUserById,
  patchUser,
  logOut,
};
