const jwt = require('jsonwebtoken');

//Load User Model
const User = require('../models/User');

require('dotenv').config();

const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(403).json({ errors: [{ msg: 'Email is taken!' }] });
    }

    user = new User({
      name,
      email,
      password
    });

    user.save((err, user) => {
      if (err) {
        return res
          .status(401)
          .json({ error: 'Error saving user in the database.' });
      }

      return res.status(200).json({
        user,
        msg: 'Signup success! Please login.'
      });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server error');
  }
};

const signIn = (req, res) => {
  //find the user based on email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    //if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: 'User with that email does not exist. Please sign in.'
      });
    }
    //If user is found make sure the email and password match
    //create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: 'Email and password do not match'
      });
    }

    //generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as 'x-auth-token' in cookie with expiry date
    res.cookie('x-auth-token', token, { expire: 3600 });
    //return response with user and token to frontend client
    const { _id, name, email, role } = user;
    return res.json({
      token,
      user: {
        _id,
        email,
        name,
        role
      }
    });
  });
};

const signOut = (req, res) => {
  const cookie = req.cookies;
  for (const prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }

    res.cookie(prop, '', { expire: new Date(0), maxAge: 0, overwrite: true });
    res.clearCookie(prop, '', {
      expire: new Date(0),
      maxAge: 0,
      overwrite: true
    });
  }
  res.clearCookie('x-auth-token');
  return res.json({ msg: ' Signout successful!.' });
};

const currentUser = async (req, res) => {
  // const user = await User.findById(req.user._id).select('-hashed_password');
  // const user = await User.findById(req.user.id).select('_id name email');

  // return res.json({
  //   user,
  // });

  await User.findById(req.user.id, (err, user) => {
    if (err) {
      return res.status(404).json({
        error: 'no user found'
      });
    }

    res.json({
      user
    });
  }).select('_id name email');
};

module.exports = {
  signUp,
  signIn,
  signOut,
  currentUser
};
