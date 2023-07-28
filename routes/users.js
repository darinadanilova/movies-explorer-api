const router = require('express').Router();
const {
  getUserById, patchUser,
} = require('../controllers/users');
const { validationPatchUser } = require('../utils/validation');

router.get('/me', getUserById);

router.patch('/me', validationPatchUser, patchUser);

module.exports = router;
