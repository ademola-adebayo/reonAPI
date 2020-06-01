const express = require('express');

//import the controllers
const { signUp, signIn, signOut, currentUser } = require('../controllers/auth');

//import the middlewares
const { authenticateUser, requireSignin } = require('../middleware');

const router = express.Router();

// @route    post auth/signup
// @desc     Signup
// @access   Public
router.route('/signup').post(signUp);
router.route('/signin').post(signIn);
router.route('/signout').get(signOut);
router.route('/current').get(authenticateUser, currentUser);

module.exports = router;
