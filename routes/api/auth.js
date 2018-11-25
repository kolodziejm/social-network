// authentication
const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const secret = require('../../config/keys').secretOrKey;

// INPUT VALIDATION
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

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
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, name, password } = req.body
  try {
    const user = await User.findOne({ email });
    if (user) {
      errors.email = 'Email already exists'
      return res.status(400).json({
        errors
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

// @route POST api/auth/login
// @desc Login user / Return JWT token to the client
// @access Public
router.post('/login', async (req, res, next) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    errors.email = 'User not found'
    return res.status(404).json(errors);
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    // User matched - sign token
    const payload = { id: user._id, name: user.name, avatar: user.avatar };
    jwt.sign(payload, secret, { expiresIn: 86400 }, (err, token) => {
      res.json({
        success: true,
        token: `Bearer ${token}`
      })
    });
  } else {
    errors.password = 'Password incorrect'
    res.status(400).json(errors)
  }
})

// @route POST api/auth/current
// @desc Return current user
// @access Private
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;