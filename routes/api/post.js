const express = require('express');
const router = express.Router();

const { createPostValidator } = require('../../validator/auth');

const { runValidation } = require('../../validator/index');


const {
  requireSignin,
  authenticateUser,
  isPostedBy,
} = require('../../middleware');

//import the controllers
const {
  getPosts,
  createPost,
  postById,
  postsByUser,
  getPostById,
  updatePost,
  deletePost,
  deletePost2,
  createLikePost,
  createUnLikePost,
  createComment,
  deleteComment,
} = require('../../controllers/post');

// @route  GET api/posts
// @desc   Get posts
// @access Private
router.route('/posts').get(authenticateUser, getPosts);

// @route  POST api/post
// @desc   Create a post
// @access Private
router
  .route('/post/new')
  .post(authenticateUser, createPostValidator, runValidation, createPost);

// @route  POST api/posts/like/:postId
// @desc   Like posts
// @access Private
router.route('/posts/like/:postId').post(authenticateUser, createLikePost);

// @route  POST api/posts/unlike/:postId
// @desc   Unlike posts
// @access Private
router.route('/posts/unlike/:postId').post(authenticateUser, createUnLikePost);

// @route  POST api/posts/comment/:postId
// @desc   Add comment to post
// @access Private
router.route('/posts/comment/:postId').post(authenticateUser, createComment);

// @route  DELETE api/posts/comment/:postId/:commentId
// @desc   Remove comment from post
// @access Private
router
  .route('/posts/comment/:postId/:commentId')
  .delete(authenticateUser, deleteComment);

// @route param
// @desc  any route containing :postId, our app will execute postById();
// @access Private
router.param('postId', postById);

// @route  GET & DELETE api/posts/:postId
// @desc   Get & Delete post by id
// @desc   Delete post
// @access Private
router
  .route('/post/:postId')
  .get(authenticateUser, getPostById)
  .put(authenticateUser, updatePost)
  .delete(authenticateUser, isPostedBy, deletePost2);

// @route  GET  api/posts/by/:userId
// @desc   Get  posts by user
// @desc   Delete post
// @access Private
router.route('/posts/by/:userId').get(authenticateUser, postsByUser);

router.route('/secretpost/:postId').get(authenticateUser, (req, res) => {
  res.json({
    user: req.post,
  });
});

module.exports = router;
