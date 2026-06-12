const { body, param, validationResult } = require('express-validator');

// Middleware untuk menangani error validation
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', errors: errors.array() });
  }
  next();
};

const validateCreatePayment = [
  body('registrationId')
    .notEmpty().withMessage('Registration ID is required')
    .isInt().withMessage('Registration ID must be an integer'),
  body('transactionId')
    .notEmpty().withMessage('Transaction ID is required').trim(),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod')
    .notEmpty().withMessage('Payment method is required').trim(),
  body('paymentStatus')
    .optional()
    .isIn(['pending', 'completed', 'failed', 'expire']).withMessage('Invalid payment status'),
  handleValidationErrors
];

const validateUpdatePayment = [
  param('id').isInt().withMessage('ID must be an integer'),
  body('transactionId').optional().notEmpty().withMessage('Transaction ID cannot be empty').trim(),
  body('amount').optional().isNumeric().withMessage('Amount must be a number'),
  body('paymentMethod').optional().notEmpty().withMessage('Payment method cannot be empty').trim(),
  body('paymentStatus').optional().isIn(['pending', 'completed', 'failed', 'expire']).withMessage('Invalid payment status'),
  handleValidationErrors
];

module.exports = { validateCreatePayment, validateUpdatePayment };