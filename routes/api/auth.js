const express = require('express');

//import the controllers
const { signUp, signIn, signOut, currentUser } = require('../../controllers/auth');

//import the middlewares
const { authenticateUser, requireSignin } = require('../../middleware');

const router = express.Router();

// @route    post auth/signup
// @desc     Signup
// @access   Public
router.route('/auth/signup').post(signUp);
router.route('/auth/signin').post(signIn);
router.route('/auth/signout').get(signOut);
router.route('/auth/current').get(authenticateUser, currentUser);

module.exports = router;
