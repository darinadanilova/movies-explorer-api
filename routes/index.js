const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { createUser } = require('../controllers/users');
const { logIn, logOut } = require('../controllers/users');
const { ErrorNotFound } = require('../utils/constants');
const {
  validationSignUp,
  validationSignIn,
} = require('../utils/validation');

router.post('/signup', validationSignUp, createUser);

router.post('/signin', validationSignIn, logIn);

router.use(auth);

router.use('/signout', logOut);
router.use('/users', require('./users'));
router.use('/movies', require('./movies'));

router.use('*', (req, res, next) => next(new NotFoundError(ErrorNotFound)));

module.exports = router;
