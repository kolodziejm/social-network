// authentication
const express = require('express');
const router = express.Router();

// @route GET api/auth/test
// @desc Tests auth route
// @access Public
router.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Auth works'
  });
})

module.exports = router;