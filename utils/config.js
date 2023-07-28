const { PORT = 3000 } = process.env;
const { MONGODB = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const { SECRET_KEY = 'some-secret-key' } = process.env;
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  PORT,
  MONGODB,
  SECRET_KEY,
  limiter,
};
