const { matchedData, validationResult } = require('express-validator');

const validate = (req, res, next) => {
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
    errors: extractedErrors
  });
};

const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg
    });
  }

  // proceed to next middleware
  next();
};

module.exports = {
  validate,
  runValidation
};
