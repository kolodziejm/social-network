// posts, comments
const express = require('express');

const router = express.Router();

// @route GET api/posts/test
// @desc Tests posts route
// @access Public
router.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Posts works'
  });
})

module.exports = router;