const validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateExperienceInput(data) { // data - object with inputs to validate
  let errors = {};
  // niepodany input field bedzie undefined, przerabiamy go na '' do walidacji isEmpty validatora (ktory przyjmuje same stringi)
  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';


  if (validator.isEmpty(data.title)) {
    errors.title = 'Job title field is required';
  }

  if (validator.isEmpty(data.company)) {
    errors.company = 'Company name field is required';
  }

  if (validator.isEmpty(data.from)) {
    errors.from = 'From date field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}