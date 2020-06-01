const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require('../config/keys');

//Load User Model
const User = require('../models/User');

//Load Profile Model
const Profile = require('../models/Profile');


const getUsers = (req, res) => {
  const users = User.find()
    .select('_id name email updated created')
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => console.log(err));
};

const getUser = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

const updateUser = async (req, res) => {
  const errors = {};
  const userFields = {};
  if (req.body.name) userFields.name = req.body.name;
  if (req.body.email) userFields.email = req.body.email;

  console.log('USERFIELDS: ', userFields);

  await User.findOneAndUpdate({ user: req.params.userId }, { $set: userFields })
    .then((user) => {
      res.status(201).json({ user, msg: 'User successfully updated.' });
    })
    .catch((err) => {
      errors.noupdate = 'Can not update the user at this time.'
      return res.status(404).json(errors)
    });
};

const deleteUser = (req, res) => {
  let user = req.profile;
  console.log('USER: ', user);
  const errors = {};
  user.remove((err, user) => {
    if (err) {
      errors.nonAuthorize = 'Not authorize to delete a resourse.';
      return res.status(400).json(errors);
    }

    // user.hashed_password = undefined;
    // user.salt = undefined;
    res.json({ msg: 'user successfully deleted.' });
  });
};

const userById = (req, res, next, id) => {
  const errors = {};
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      errors.nouser = 'User not found';
      return res.status(400).json(errors);
    }

    // adds profile object in req with user info
    req.profile = user;

    next();
  });
};



module.exports = {
  getUsers,
  userById,
  getUser,
  updateUser,
  deleteUser,
};
