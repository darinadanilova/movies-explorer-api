const jwt = require('jsonwebtoken');
require('dotenv').config();
const { SECRET_KEY } = require('../utils/config');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { UnauthorizedUser } = require('../utils/constants');

const auth = (req, res, next) => {
  if (req.cookies.jwt) {
    const token = req.cookies.jwt;
    try {
      const payload = jwt.verify(token, SECRET_KEY);
      req.user = payload;
    } catch (err) {
      next(new UnauthorizedError(UnauthorizedUser));
      return;
    }
  } else {
    next(new UnauthorizedError(UnauthorizedUser));
    return;
  }
  next();
};

module.exports = auth;
