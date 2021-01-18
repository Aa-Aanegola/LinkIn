const validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegistration(data) {
    let errors = {};

    console.log('Registration underway');
    console.log(data);

    data.email = !isEmpty(data.email) ? data.email : "";
    data.password = !isEmpty(data.password) ? data.password : "";
    data.type = !isEmpty(data.type) ? data.type : "";
    data.name = !isEmpty(data.name) ? data.name : "";

    // Name checks
    if (validator.isEmpty(data.name)) {
        errors.name = "Name field is required";
    }
    // Email checks
    if (validator.isEmpty(data.email)) {
        errors.email = "Email field is required";
    } else if (!validator.isEmail(data.email)) {
        errors.email = "Email is invalid";
    }
    // Password checks
    if (validator.isEmpty(data.password)) {
        errors.password = "Password field is required";
    }

    if (!validator.isLength(data.password, { min: 6, max: 16 })) {
        errors.password = "Password must be at least 6 characters and atmost 16 characters";
    }

    console.log(errors);

    return {
        errors,
        valid: isEmpty(errors)
    };
};