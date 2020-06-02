const express = require('express');

//import the controllers
const {
  signUp,
  signIn,
  signOut,
  currentUser
} = require('../../controllers/auth');

//import the middlewares
const { authenticateUser, requireSignin } = require('../../middleware');

const {
  check,
  body,
  matchedData,
  validationResult
} = require('express-validator');

const { signupValidate, signinValidate } = require('../../validator/auth');

//import validator
const { runValidation } = require('../../validator/index');

const router = express.Router();


// @route    post auth/signup
// @desc     Signup
// @access   Public
router.route('/auth/signup').post(signupValidate, runValidation, signUp);
router.route('/auth/signin').post(signinValidate, runValidation,signIn);
router.route('/auth/signout').get(signOut);
router.route('/auth/current').get(authenticateUser, currentUser);

module.exports = router;
