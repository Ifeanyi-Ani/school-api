const { default: mongoose } = require('mongoose');
const User = require('../models/User');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');

const sendToken = (res, user, statusCode) => {
  const id = user.universityID;
  const token = jwt.sign({ id }, proccess.env.JWT_SECRET, {
    expiresIn: '1hr',
  });
  user.pswd = undefined;
  res.status(statusCode).json({
    token,
    user,
  });
};
exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.name === mongoose.validationError) {
      return next(createError(402, err.message));
    }
    next(err);
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
exports.getUser = async (req, res, next) => {
  try {
    const { universityID } = req.params;
    const user = await User.findById(universityID);
    if (!user) {
      return next(createError(404, 'no user found with that university id'));
    }
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      return next(createError(400, 'invalid universityID'));
    }
    next(err);
  }
};
exports.editUser = async (req, res, next) => {
  try {
    const { universityID } = req.params;
    const user = await User.findByIdAndUpdate(universityID, req.body, {
      new: true,
      runValidators: false,
    });
    if (!user) {
      return next(createError(404, 'no user found with that university id'));
    }
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      return next(createError(400, 'invalid universityID'));
    }
    next(err);
  }
};
exports.deleteUser = async (req, res, next) => {
  try {
    const { universityID } = req.params;
    const user = await User.findByIdAndDelete(universityID);
    if (!user) {
      return next(createError(404, 'no user found with that university id'));
    }
    res.status.json(user);
  } catch (err) {
    if (err instanceof mongoose.CastError) {
      return next(createError(400, 'invalid universityID'));
    }
  }
};
exports.login = async (req, res, next) => {
  try {
    const { universityID, pswd } = req.body;
    const user = await User.findOne({ universityID }).select('+pswd');
    if (!user || !(await user.correctPassword(pswd, user.pswd))) {
      throw createError(401, 'incorrect details');
    }
    sendToken(res, user, 200);
  } catch (err) {
    next(err);
  }
};
