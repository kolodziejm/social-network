// authentication
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const router = express.Router();

const User = require('../../models/User');

// @route GET api/auth/test
// @desc Tests auth route
// @access Public
router.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Auth works'
  });
})

// @route POST api/auth/register
// @desc Register user
// @access Public
router.post('/register', async (req, res, next) => { // function or create and import a controller to handle
  const { email, name, password } = req.body
  try {
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      })
    } else {
      const avatar = gravatar.url(email, {
        s: '200', // Size
        r: 'pg', // Rating
        m: 'mm', // default
      });
      const hashedPw = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        email,
        avatar,
        password: hashedPw
      });
      const savedUser = await newUser.save();
      res.json({
        user: savedUser
      })
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
});

module.exports = router;