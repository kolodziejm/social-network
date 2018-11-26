// posts, comments
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// VALIDATION
const validatePostInput = require('../../validation/post');

const router = express.Router();

// @route GET api/posts/test
// @desc Tests posts route
// @access Public
router.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Posts works'
  });
})

// @route GET api/posts
// @desc Get all posts
// @access Public
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ date: -1 }); // date: -1 - date by descending order, newest first
    res.json(posts);
  } catch (err) {
    res.status(404).json({
      nopostsfound: 'No posts found'
    });
  }
});

// @route GET api/post/:id
// @desc Get a single post by id
// @access Public
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    res.json(post);
  } catch (err) {
    res.status(404).json({
      nopostfound: 'No post found with that id'
    });
  }
});

// @route POST api/posts
// @desc Create a post
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { text, name, avatar } = req.body;
  const newPost = new Post({
    text,
    name,
    avatar,
    user: req.user.id // logged in user extracted from jwt
  });
  const post = await newPost.save();
  res.json(post);
});

// @route DELETE api/post/:id
// @desc Delete a post
// @access Private
router.delete('/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);
    // Check for post owner
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ notauthorized: 'User not authorized' });
    }
    await post.remove();
    res.json({ success: true });
  } catch (err) {
    res.status(404).json({
      postnotfound: 'No post found'
    });
  }
});

// @route POST api/post/like/:id
// @desc Like a post
// @access Private
router.post('/like/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);
    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) { // .length > 0 - user already liked the post, his id is in array
      // post.likes - array of user.ids who have liked the post
      return res.status(400).json({ alreadyliked: 'User already liked this post' });
    }
    // Add user id to likes array
    post.likes.unshift({ user: req.user.id }) // unshift adds to the beginning of the array
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {

  }
});

// @route POST api/post/unlike/:id
// @desc Unlike a post
// @access Private
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const post = await Post.findById(req.params.id);
    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) { // .length = 0 - user haven't already liked the post
      // post.likes - array of user.ids who have liked the post
      return res.status(400).json({ notliked: 'You have not yet liked this post' });
    }
    // Get remove index
    const removeIndex = post.likes // removeIndex - user we want to remove
      .map(item => item.user.toString())
      .indexOf(req.user.id);
    post.likes.splice(removeIndex, 1); // clears the likes array from this user
    const savedPost = await post.save();
    res.json(savedPost);

  } catch (err) {

  }
});

// @route POST api/posts/comment/:id
// @desc Add comment to post
// @access Private
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { errors, isValid } = validatePostInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  try {
    const { text, name, avatar } = req.body;
    const post = await Post.findById(req.params.id);
    const newComment = {
      text,
      name,
      avatar,
      user: req.user.id // extracted from jwt
    };
    post.comments.unshift(newComment);
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(404).json({
      postnotfound: 'No post found'
    })
  }
});

// @route DELETE api/posts/comment/:id/:comment_id
// @desc Delete comment from post
// @access Private
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  // id - post id, comment_id - comment id
  try {
    const post = await Post.findById(req.params.id);
    if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
      // Comment doesn't exist
      return res.status(404).json({ commentnotexists: 'Comment does not exist' });
    }
    const removeIndex = post.comments // comment to remove
      .map(comment => comment._id.toString())
      .indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);
    const savedPost = await post.save();
    res.json(savedPost);
  } catch (err) {
    res.status(404).json({
      postnotfound: 'No post found'
    })
  }
});

module.exports = router;