const { body, validationResult } = require('express-validator');

// Helper validation checker middleware
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

const productRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ max: 100 })
    .withMessage('Product name cannot exceed 100 characters'),
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required')
    .matches(/^[a-zA-Z0-9-]+$/)
    .withMessage('SKU must be alphanumeric and can only contain hyphens (-)')
    .isLength({ min: 3, max: 30 })
    .withMessage('SKU must be between 3 and 30 characters'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('stock')
    .notEmpty()
    .withMessage('Stock level is required')
    .isInt({ min: 0 })
    .withMessage('Stock must be a positive integer'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

module.exports = {
  validateProduct: [productRules, validate],
};
