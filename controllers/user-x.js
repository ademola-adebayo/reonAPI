const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = require("../config/keys");

//Load User Model
const User = require('../models/User');

const getUsers = (req, res) => {
  const users = User.find()
    .select('_id name email')
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => console.log(err));
};

const registerUser = (req, res) => {
  User.findOne({
    email: req.body.email,
  }).then((user) => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists',
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;

          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
};

const loginUsers = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //Find user by email
  User.findOne({ email }).then((user) => {
    //Check for user
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }

    //Check & Comapare password
    bcrypt
      .compare(password, user.password)
      .then((isMatch) => {
        if(isMatch) {
          //User Matched

          //Creat jwt payload
          const payload = { id: user.id, name: user.name };

          //Sign Token
          jwt.sign(payload, keys.SECRET_KEY, { expiresIn: 3600 },(err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token
            })
          })
        } else  {
          return res.status(400).json({
            msg: 'Email/Password incorrect',
          });
        }       
      })
      .catch((err) => console.log(err));
  });
};

module.exports = {
  getUsers,
  registerUser,
  loginUsers,
};