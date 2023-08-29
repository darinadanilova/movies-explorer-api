const jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { UnauthorizedUser } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnauthorizedError(UnauthorizedUser));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY);
  } catch (err) {
    next(new UnauthorizedError(UnauthorizedUser));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
