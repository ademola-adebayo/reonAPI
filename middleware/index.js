const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const User = require('../models/User');

const authenticateUser = async (req, res, next) => {
  //get the token from the header if present
  const token = req.cookies['x-auth-token'].replace('Bearer ', '');

  console.log('TOKEN: ', token);
  //if no token found, return response (without going to the next middelware)

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    if (!user || !token) {
    }
    //if can verify the token, set req.user and pass to next middleware
    req.user = user;
    req.token = token;
    next();
  } catch (ex) {
    //if invalid token
    res.status(401).send('Not authorized to access this resource');
  }
};

const authenticateUserX = async (req, res, next) => {
  console.log('COOKIE STORED: ', req.cookies);
  //get the token from the header if present
  const token = req.cookies['x-auth-token'];
  console.log('TOKEN: ', token);
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    //if can verify the token, set req.user and pass to next middleware
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    //if invalid token
    res.status(401).send('Not authorized to access this resource');
  }
};

const requireSignin = expressJwt({
  // if the token is valid, express-jwt appends the verified users id in an auth key to the request object
  secret: process.env.JWT_SECRET,
  userProperty: 'user',
});

const hasAuthorization = (req, res, next) => {
  const errors = {};
  const authorized =
    req.profile && req.user && req.profile._id === req.user._id;
  if (!authorized) {
    errors.notAuthorized =
      'User is not authorized to perform this action. Access denied.';
    return res.status(403).json(errors);
  }
  next();
};

const isAuth = (req, res, next) => {
  let user = req.profile && req.user && req.profile._id == req.user._id;

  if (!user) {
    return res.status(403).json({
      error: 'Access denied.',
    });
  }

  next();
};

const isAdmin = (req, res, next) => {
  if (req.profile.role === 'subscriber' || req.user.role === 0) {
    return res.status(403).json({
      error: 'Admin resource! Access denied.',
    });
  }

  next();
};

const isPostedBy = (req, res, next) => {
  const isPoster =
    req.post && req.user && req.post.postedBy._id.toString() === req.user._id.toString();

  console.log(req.post.postedBy._id.toString() === req.user._id.toString());

  if (!isPoster) {
    return res.status(403).json({
      error: 'User not authorized.',
    });
  }

  next();
};

module.exports = {
  authenticateUser,
  requireSignin,
  isPostedBy,
  hasAuthorization,
  isAuth,
  isAdmin,
};
