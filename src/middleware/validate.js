const { validationResult, body } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({ 
        field: err.path, 
        message: err.msg 
    }))
    });
  }
  next();
};

const productValidationRules = [
  body('name')
    .notEmpty().withMessage('Product name is required')
    .isLength({ max: 100 }).withMessage('Name must not exceed 100 characters')
    .trim().escape(),

  body('price')
    .isFloat({ gt: 0 }).withMessage('Price must be greater than zero'),

  body('stock_quantity')
    .isInt({ min: 0 }).withMessage('Stock cannot be negative'),

  body('category_id')
    .isInt({ gt: 0 }).withMessage('Valid Category ID is required'),

  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description must not exceed 500 characters')
    .trim().escape()
];

module.exports = { validateRequest, productValidationRules };