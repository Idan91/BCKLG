const emptyErrorMessage = "Must not be empty";

const isEmpty = string => {
  return string.trim() === "";
};

const isEmail = email => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regEx.test(String(email).toLowerCase());
};

exports.validateSignupData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = emptyErrorMessage;
  } else if (!isEmail(data.email)) {
    errors.email = "Must be a valid email address";
  }

  if (isEmpty(data.password)) {
    errors.password = emptyErrorMessage;
  }
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Passwords must be the same";
  }
  if (isEmpty(data.username)) {
    errors.username = emptyErrorMessage;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateLoginData = data => {
  let errors = {};

  if (isEmpty(data.email)) {
    errors.email = emptyErrorMessage;
  }
  if (isEmpty(data.password)) {
    errors.password = emptyErrorMessage;
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateForgotPassword = emailForgot => {
  let errors = {};

  if (isEmpty(emailForgot)) {
    errors.emailForgot = emptyErrorMessage;
  } else if (!isEmail(emailForgot)) {
    errors.emailForgot = "Must be a valid email address";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};

exports.validateUpdatePassword = data => {
  let errors = {};

  if (isEmpty(data.currentPassword)) {
    errors.currentPassword = emptyErrorMessage;
  }
  if (isEmpty(data.newPassword)) {
    errors.newPassword = emptyErrorMessage;
  }
  if (data.newPassword !== data.confirmNewPassword) {
    errors.confirmNewPassword = "Passwords must be the same";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false
  };
};
