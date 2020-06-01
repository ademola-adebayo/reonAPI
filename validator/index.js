const {
  check,
  body,
  matchedData,
  validationResult,
} = require('express-validator');

const Validator = require('validator');

const isEmpty = require('./is-empty');

const createPostValidator = [
  // title
  check('title', 'Write a title')
    .not()
    .isEmpty()
    .isLength({
      min: 10,
      max: 30,
    })
    .withMessage('Title must be between 10 to 30 characters'),

    body('text', 'Write a body text')
    .not()
    .isEmpty()
    .isLength({
           min: 10,
           max: 300,
    })
    .withMessage('text must be between 10 to 300 characters')
    .trim()
    .escape()
    ,
];

const signupValidate = () => {
  return [
    check('name', 'Name is required').notEmpty(),

    //check email
    check('email', 'Email must be between 3 to 32 chracters')
      .isEmail()
      .normalizeEmail('Invalid email'),

    //check for password
    check('password', 'Enter a password')
      .notEmpty()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
  ];
};

const validate = (req, res, next) => {
  console.log('i got here indeed');
  // const result = validationResult(req);

  // const { errors } = result;
  // if (errors.isEmpty()) {
  //   return next();
  // }
  // // console.log('Errors: ', errors);
  // const firstError = errors.map((error) => error.msg)[0];

  // return res.status(400).json({
  //   error: firstError,
  // });
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    req.matchedData = matchedData(req);
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

  return res.status(422).json({
    errors: extractedErrors,
  });
};

const validatorResult = (req, res, next) => {
  //check for errors
  const result = validationResult(req);
  const hasErrors = !result.isEmpty();

  //if error show the first one as they happen

  if (hasErrors) {
    // const firstError = result.array()[0].msg;

    // return res.status(400).json({
    //   errorMsg: firstError,
    // });

    const { errors } = result;

    // console.log('Errors: ', errors);
    const firstError = errors.map((error) => error.msg)[0];

    return res.status(400).json({
      error: firstError,
    });
  }

  // proceed to next middleware
  next();
};

const validateCreatePostInput = (req, res, next) => {
    let errors = {};

    
    data.title = !isEmpty(data.title) ? data.title : '';
    data.text = !isEmpty(data.text) ? data.text : '';
  
  
    if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
      errors.text = 'Post must be between 10 and 300 characters.';
    }

    if (!Validator.isLength(data.title, { min: 10, max: 30 })) {
      errors.text = 'Title must be between 10 and 30 characters.';
    }
    
    if (Validator.isEmpty(data.title)) {
      errors.title = 'Title field is Required';
    }
    if (Validator.isEmpty(data.text)) {
      errors.text = 'Text field is Required';
    }
  
    return {
      errors,
      isValid: isEmpty(errors),
    };
}

const validateSignupInput = function (data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is Required';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is Required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is Required';
  }

  if (!Validator.matches(data.password, /\d/)) {
    errors.password = 'Password must contain a number';
  }

  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be at least 6 characters long';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is Required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateSigninInput = function (data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is Required';
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is Required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateExperienceInput = function (data) {
  let errors = {};

  data.title = !isEmpty(data.title) ? data.title : '';
  data.company = !isEmpty(data.company) ? data.company : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.title)) {
    errors.title = 'Job title field is Required';
  }

  if (Validator.isEmpty(data.company)) {
    errors.company = 'Company field is Required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is Required';
  }

  // if (!Validator.isEmail(data.email)) {
  //   errors.email = 'Email is invalid';
  // }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateEducationInput = function (data) {
  let errors = {};

  data.school = !isEmpty(data.school) ? data.school : '';
  data.degree = !isEmpty(data.degree) ? data.degree : '';
  data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
  data.from = !isEmpty(data.from) ? data.from : '';

  if (Validator.isEmpty(data.school)) {
    errors.school = 'School field is Required';
  }

  if (Validator.isEmpty(data.degree)) {
    errors.degree = 'Degree field is Required';
  }

  if (Validator.isEmpty(data.fieldofstudy)) {
    errors.fieldofstudy = 'Field of study field is Required';
  }

  if (Validator.isEmpty(data.from)) {
    errors.from = 'From date field is Required';
  }


  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validateProfileInput = function (data) {
  let errors = {};

  data.handle = !isEmpty(data.handle) ? data.handle : '';
  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';
  data.city = !isEmpty(data.city) ? data.city : '';
  data.country = !isEmpty(data.country) ? data.country : '';

  if (!Validator.isLength(data.handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 40 characters';
  }

  if (Validator.isEmpty(data.handle)) {
    errors.handle = 'Profile handle is Required';
  }

  if (Validator.isEmpty(data.status)) {
    errors.status = 'Status field is Required';
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = 'Skills field is required';
  }

  if (Validator.isEmpty(data.city)) {
    errors.city = 'City field is required';
  }

  if (Validator.isEmpty(data.country)) {
    errors.country = 'Country field is required';
  }

  if (!isEmpty(data.youtube)) {
    if (!Validator.isURL(data.youtube)) {
      errors.youtube = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.facebook)) {
    if (!Validator.isURL(data.facebook)) {
      errors.facebook = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.linkedin)) {
    if (!Validator.isURL(data.linkedin)) {
      errors.linkedin = 'Not a valid URL';
    }
  }

  if (!isEmpty(data.kingschat)) {
    if (!Validator.isURL(data.kingschat)) {
      errors.kingschat = 'Not a valid URL';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const validatePostInput = function(data) {
  let errors = {};
  data.text = !isEmpty(data.text) ? data.text : '';

  if(!Validator.isLength(data.text, {min:10, max:300})) {
    errors.text = 'Post must be between 10 and 300 characters.'
  }

  if(Validator.isEmpty(data.text)) {
    errors.text = "Text field is required."
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}

module.exports = {
  createPostValidator,
  signupValidate,
  validate,
  validatorResult,
  validateCreatePostInput,
  validateSignupInput,
  validateSigninInput,
  validateExperienceInput,
  validateEducationInput,
  validateProfileInput,
  validatePostInput
};
