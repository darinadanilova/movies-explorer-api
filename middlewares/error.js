const ServerError = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      statusCode,
      message: statusCode === 500
        ? ServerError
        : message,
    });
  next(err);
};

module.exports = errorHandler;
