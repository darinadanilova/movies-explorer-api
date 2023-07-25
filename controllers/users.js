const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const { SECRET_KEY } = require('../utils/config');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

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
        next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findOne({ email })
    .select('+password')
    .orFail(() => next(new UnauthorizedError('Вы ввели неверные email и пароль')))
    .then((user) => bcrypt.compare(password, user.password)
      .then((isValidUser) => {
        if (isValidUser) {
          return user;
        }
        return next(new UnauthorizedError('Вы ввели неверные email и пароль'));
      }))
    .then((user) => {
      const jwt = jsonWebToken.sign({
        _id: user._id,
      }, SECRET_KEY, { expiresIn: '7d' });
      res
        .cookie('jwt', jwt, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .send({ data: user.toJSON() });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Вы ввели некорректные данные'));
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
        next(new BadRequestError('Вы ввели некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getUserById,
  patchUser,
};
