const jwt = require('jsonwebtoken');

//Load User Model
const User = require('../models/User');

const {
  validateSignupInput,
  validateSigninInput,
} = require('../validator/index');

require('dotenv').config();

const signUp = async (req, res) => {
  const { errors, isValid } = validateSignupInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const userExists = await User.findOne({ email: req.body.email });

  if (userExists) {
    // return res.status(403).json({
    //   error: 'Email is taken!',
    // });
    errors.email = 'Email is taken!';
    return res.status(403).json(errors);
  }

  const user = new User(req.body);

  user.save().then((user) => {
    res.status(200).json({
      user,
      msg: 'Signup success! Please login.',
    });
  });
};

const signIn = (req, res) => {
  const { errors, isValid } = validateSigninInput(req.body);

  //check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  //find the user based on email
  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    //if err or no user
    if (err || !user) {
      errors.email = 'User with that email does not exist. Please sign in.';
      return res.status(401).json(errors);
      // return res.status(401).json({
      //   error: 'User with that email does not exist. Please sign in.',
      // });
    }
    //If user is found make sure the email and password match
    //create authenticate method in model and use here
    if (!user.authenticate(password)) {
      errors.password = 'Email and password do not match';
      return res.status(401).json(errors);
      // return res.status(401).json({
      //   error: 'Email and password do not match',
      // });
    }

    //generate a token with user id and secret
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    //persist the token as 'x-auth-token' in cookie with expiry date
    res.cookie('x-auth-token', token, { expire: 3600 });
    //return response with user and token to frontend client
    const { _id, name, email } = user;
    return res.json({
      token,
      user: {
        _id,
        email,
        name,
      },
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
      overwrite: true,
    });
  }
  res.clearCookie('x-auth-token');
  return res.json({ msg: ' Signout successful!.' });
};

const currentUser = async (req, res) => {
  const errors = {};
  // const user = await User.findById(req.user._id).select('-hashed_password');
  // const user = await User.findById(req.user.id).select('_id name email');

  // return res.json({
  //   user,
  // });

  await User.findById(req.user.id, (err, user) => {
    if (err ) {
      errors.nouserFound = 'no user found';
      return res.status(404).json(errors);
    }

    res.json({
      user,
    });
  }).select('_id name email');
};

module.exports = {
  signUp,
  signIn,
  signOut,
  currentUser,
};
