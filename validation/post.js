const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) { // data - object with inputs to validate
  let errors = {};
  // niepodany input field bedzie undefined, przerabiamy go na '' do walidacji isEmpty validatora (ktory przyjmuje same stringi)
  data.text = !isEmpty(data.text) ? data.text : '';

  if (!validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = 'Post must be between 10 and 300 characters';
  }

  if (validator.isEmpty(data.text)) { // is empty should be last (least detailed check)
    errors.text = 'Text field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}