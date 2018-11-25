// location, bio, info about the user
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// validation functions
const validateProfileInput = require('../../validation/profile');

const router = express.Router();

// @route GET api/profile/test
// @desc Tests profile route
// @access Public
router.get('/test', (req, res, next) => {
  res.status(200).json({
    message: 'Profile works'
  });
})

// @route GET api/profile - bez params,bo JWT daje nam info o userze (to jest chroniona sciezka)
// @desc Get current user's profile
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const errors = {};
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']); // w profilu mamy referencje do usera. req.user - object extracted from jwt
    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (err) {
    res.status(404).json(err);
  }
})

// @route GET api/profile/all
// @desc Get all profiles
// @access Public
router.get('/all', async (req, res, next) => {
  const errors = {};
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    if (!profiles) {
      errors.noprofile = 'There are no profiles';
      return res.status(404).json(errors);
    }
    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(404).json({ profile: 'There are no profiles' });
  }
});


// @route GET api/profile/handle/:handle
// @desc Get profile by handle
// @access Public
router.get('/handle/:handle', async (req, res, next) => {
  const errors = {};
  try {
    const profile = await Profile
      .findOne({ handle: req.params.handle }).
      populate('user', ['name', 'avatar']);

    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
});

// @route GET api/profile/user/:user_id
// @desc Get profile by user id
// @access Public
router.get('/user/:user_id', async (req, res, next) => {
  const errors = {};
  try {
    const profile = await Profile
      .findOne({ user: req.params.user_id }).
      populate('user', ['name', 'avatar']);

    if (!profile) {
      errors.noprofile = 'There is no profile for this user';
      return res.status(404).json(errors);
    }
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(404).json({ profile: 'There is no profile for this user' });
  }
});


// @route POST api/profile
// @desc Create or Edit user profile
// @access Private
router.post('/', passport.authenticate('jwt', { session: false }), async (req, res, next) => {
  const { errors, isValid } = validateProfileInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Get data from form
  const profileFields = {};
  profileFields.user = req.user.id; // z jwt
  if (req.body.handle) profileFields.handle = req.body.handle; // sprawdzenie czy zostalo wyslane, jak tak to przypisanie do profileFields
  if (req.body.company) profileFields.company = req.body.company;
  if (req.body.website) profileFields.website = req.body.website;
  if (req.body.location) profileFields.location = req.body.location;
  if (req.body.bio) profileFields.bio = req.body.bio;
  if (req.body.status) profileFields.status = req.body.status;
  if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;
  // Skills - split comma separated values (xyz, asd...) into array
  if (typeof req.body.skills !== 'undefined') {
    profileFields.skills = req.body.skills.split(',') // array of skills
  }

  // Social
  profileFields.social = {};
  if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
  if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
  if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
  if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
  if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

  const profile = await Profile.findOne({ user: req.user.id });
  if (profile) {
    // Update
    const updatedProfile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
    res.json(updatedProfile);
  } else {
    // Create

    // Check if handle exists (handle - url/user/handle) for easy access. Tak jak na fb.
    const profile = await Profile.findOne({ handle: profileFields.handle });
    if (profile) {
      errors.handle = 'That handle already exists';
      return res.status(400).json(errors);
    }

    // Save Profile
    const savedProfile = await new Profile(profileFields).save()
    res.json(savedProfile);
  }

})

module.exports = router;