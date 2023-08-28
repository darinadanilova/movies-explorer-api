require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const router = require('./routes');
const {
  PORT,
  MONGODB,
  limiter,
} = require('./utils/config');
const errorHandler = require('./middlewares/error');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const ErrorServer = require('./utils/constants');

const app = express();
app.use(express.json());

app.use(cors({
  credentials: true,
  origin: [
    'http://darinadanilova.nomoreparties.sbs',
    'http://api.darinadanilova.nomoreparties.sbs',
    'https://darinadanilova.nomoreparties.sbs',
    'https://api.darinadanilova.nomoreparties.sbs',
    'localhost:3000',
    'http://localhost:3000',
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));

app.use(requestLogger);
app.use(limiter);
app.use(helmet());

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error(ErrorServer);
  }, 0);
});

app.use(cookieParser());

app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
