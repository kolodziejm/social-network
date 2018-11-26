// posts, comments
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

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

module.exports = router;