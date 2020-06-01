const express = require('express');

const router = express.Router();

const {
  getUsers,
  registerUser,
  loginUsers,
} = require('../../controllers/user');
 
// @route    GET api/user
// @desc     Tests users route
// @access   Public
router.route('/users').get(getUsers);

// @route    POST api/user/register
// @desc     Register users route
// @access   Public
router.route('/user/register').post(registerUser);

// @route    GET api/users/login
// @desc     Login User route
// @access   Public
router.route('/users/login').post(loginUsers);


module.exports = router;