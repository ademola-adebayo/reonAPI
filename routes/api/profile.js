const express = require('express');
const router = express.Router();

const {
  createProfileValidator,
  addEducationValidator,
  addExperienceValidator
} = require('../../validator/auth');

const { runValidation } = require('../../validator');

//import the controllers
const {
  getProfiles,
  getProfileByHandle,
  getProfileById,
  addExperience,
  addEducation,
  deleteExperience,
  deleteEducation,
  deleteProfile,
  getCurrentUserProfile,
  createAndUpdateUserProfile,
  createAndUpdateUserProfile2
} = require('../../controllers/profile');

const { authenticateUser, requireSignin } = require('../../middleware');

// @route    GET api/profile/handle/:handle
// @desc     Get profile by handle
// @access   Public
router.route('/profile/by/handle/:handle').get(getProfileByHandle);

// @route    GET api/profile/user/:userId
// @desc     Get profile by userId
// @access   Public
router.route('/profile/user/:userId').get(getProfileById);

// @route    GET api/profile/all
// @desc     Get all profiles
// @access   Public
router.route('/profile/all').get(authenticateUser, getProfiles);

// @route    POST api/profile/add/experience
// @desc     Add experience to profile
// @access   Private
router
  .route('/profile/add/experience')
  .post(authenticateUser, addExperienceValidator, runValidation, addExperience);

// @route    POST api/profile/add/education
// @desc     Add experience to profile
// @access   Private
router
  .route('/profile/add/education')
  .post(authenticateUser, addEducationValidator, runValidation, addEducation);

// @route    DELETE api/profile/delete/experience/:exp_id
// @desc     Delete experience from profile
// @access   Private
router
  .route('/profile/delete/experience/:expId')
  .delete(authenticateUser, deleteExperience);

// @route    DELETE api/profile/delete/education/:eduId
// @desc     Delete education from profile
// @access   Private
router
  .route('/profile/delete/education/:eduId')
  .delete(authenticateUser, deleteEducation);

// @route    DELETE api/profile/delete
// @desc     Delete user and profile
// @access   Private
router.route('/profile/delete').delete(authenticateUser, deleteProfile);

// @route    GET api/user/profile/me
// @desc     Get current users profile
// @access   Private
router.route('/user/profile/me').get(authenticateUser, getCurrentUserProfile);

// @route    POST api/user/profile
// @desc     Create or update user profile
// @access   Private
router
  .route('/user/profile')
  .post(
    authenticateUser,
    createProfileValidator,
    runValidation,
    createAndUpdateUserProfile
  );

module.exports = router;
