// location, bio, info about the user
const express = require('express');

const router = express.Router();

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Profile works'
  });
})

module.exports = router;