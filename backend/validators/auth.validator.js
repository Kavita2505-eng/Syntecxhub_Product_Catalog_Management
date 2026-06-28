const { body, validationResult } = require('express-validator');

// Validation middleware to handle formatting errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map((err) => err.msg).join(', ');
    return res.status(400).json({
      success: false,
      error: errorMsg,
    });
  }
  next();
};

const registerRules = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const loginRules = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email/Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

module.exports = {
  validateRegister: [registerRules, validate],
  validateLogin: [loginRules, validate],
};
