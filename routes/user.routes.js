const express = require('express');
const {
  createUser,
  getUsers,
  getUser,
  deleteUser,
  editUser,
} = require('../controllers/user.controllers');

const router = express.Router();

router.route('/').get(getUsers).post(createUser);

router.route('/:universityID').get(getUser).patch(editUser).delete(deleteUser);

module.exports = router;
