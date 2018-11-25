const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfileInput(data) { // data - object with inputs to validate
  let errors = {};
  // niepodany input field bedzie undefined, przerabiamy go na '' do walidacji isEmpty validatora (ktory przyjmuje same stringi)
  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

  // REQUIRED FIELDS
  if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle have to be between 2 and 40 characters';
  }

  if (validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (validator.isEmpty(data.status)) {
    errors.status = 'Status field is required';
  }

  if (validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  // OPTIONAL FIELDS
  if (!isEmpty(data.website)) { // if website is filled in we want to check if it's formatted as url
    if (!validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.youtube)) {
    if (!validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.twitter)) {
    if (!validator.isURL(data.twitter)) {
      errors.twitter = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.instagram)) {
    if (!validator.isURL(data.instagram)) {
      errors.instagram = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}