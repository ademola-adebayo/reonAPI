const Post = require('../models/Post');
const Profile = require('../models/Profile');

const { validatePostInput } = require('../validator');

const getPosts = (req, res) => {
  const posts = Post.find()
    .populate('postedBy', '_id name')
    .sort({ date: -1 })
    .select('_id title text postedBy')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) =>
      res.status(404).json({
        nopostsfound: 'No posts found.',
      })
    );
};

const postById = (req, res, next, id) => {
  Post.findById(id)
    .populate('postedBy', '_id name')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(404).json({ postnotfound: 'Post not found.' });
      }

      req.post = post;
      next();
    });
};

const getPostById = (req, res) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ postnotfound: 'Post not found.' });
      }
      res.json(post);
    })
    .catch((err) =>
      res.status(404).json({
        nopostfound: 'No post found with that ID.',
      })
    );
};

const createLikePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res
            .status(400)
            .json({ alreadyliked: 'User already liked this post' });
        }

        //Add user id to likes array
        post.likes.unshift({ user: req.user.id });

        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
  });
};

const createUnLikePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.postId)
      .then((post) => {
        if (
          post.likes.filter((like) => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ notliked: 'You have not yet liked this post' });
        }

        //Get remove index
        const removeIndex = post.likes
          .map((item) => item.user.toString())
          .indexOf(req.user.id);

        //Splice out of array
        post.likes.splice(removeIndex, 1);

        //Save
        post.save().then((post) => res.json(post));
      })
      .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
  });
};

const postsByUser = (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name')
    .sort('_created')
    .exec((err, posts) => {
      if (err || !posts) {
        return res
          .status(404)
          .json({ nopostbyuser: 'User does not have any posts.' });
      }

      res.json(posts);
    });
};

const createComment = (req, res) => {
  Post.findById(req.params.postId)
    .then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        user: req.user.id,
      };

      //Add to comments array
      post.comments.unshift(newComment);

      // Save
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
};

const deleteComment = (req, res) => {
  Post.findById(req.params.postId)
    .then((post) => {
      //Check to see if comment exists
      if (
        post.comments.filter(
          (comment) => comment._id.toString() === req.params.commentId
        ).length === 0
      ) {
        return res
          .status(404)
          .json({ commentnotexist: 'Comment does not exist' });
      }

      //Get remove index
      const removeIndex = post.comments
        .map((item) => item._id.toString())
        .indexOf(req.params.commentId);

      //Splice comment out of array
      post.comments.splice(removeIndex, 1);

      //Save
      post.save().then((post) => res.json(post));
    })
    .catch((err) => res.status(404).json({ postnotfound: 'No post found' }));
};

const deletePost2 = (req, res) => {
  let post = req.post;

  console.log('POST TO DELETE: ', post);

  post.remove((err, post) => {
    if (err) {
      return res.status(400).json({ notauthorized: ' user not authorized.' });
    }
    res.json({
      msg: 'Post deleted successfully.',
    });
  });
};

const deletePost = (req, res) => {
  Profile.findOne({ user: req.user.id }).then((profile) => {
    Post.findById(req.params.id)
      .then((post) => {
        //Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res
            .status(401)
            .json({ notauthorized: 'user not authorized.' });
        }

        //Delete
        post
          .remove()
          .then(() =>
            res.json({ success: true, msg: 'Post deleted successfully' })
          );
      })
      .catch((err) => res.status(404).json({ postnotfound: 'No post found.' }));
  });
};

const updatePost = async (req, res) => {
  const updateFields = {};
  if (req.body.title) updateFields.title = req.body.title;
  if (req.body.text) updateFields.text = req.body.text;

  console.log('UDATEFIELDS: ', updateFields);

  await Post.findOneAndUpdate({ post: req.post.postId }, { $set: updateFields })
    .then((post) => {
      res.status(201).json({ msg: 'Post successfully updated.' });
    })
    .catch((err) => {
      return res.status(404).json({
        noupdate: 'Can not update the post at this time.'
      });
    });
};

const createPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    text: req.body.text,
    name: req.body.name,
    photo: req.body.photo,
    user: req.user.id,
    postedBy: req.user.id,
  });

  // post.save((err, result) => {
  //   if(err) {
  //     return res.status(400).json({
  //       error: err
  //     });
  //   }

  //   res.status(200).json({
  //     post: result
  //   });
  // });


  newPost.save((err, post) => {
    if (err) {
      return res
        .status(401)
        .json({ error: 'Error saving post in the database.' });
    }

    return res.status(200).json({
      post,
      msg: 'Post saved successfully.'
    });
  });
};



module.exports = {
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
};
