const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', errors: errors.array() });
  }
  next();
};

const validateCreateTeam = [
  body('leaderId')
    .optional()
    .isInt().withMessage('Leader ID must be a valid integer/bigint'),
  body('teamName')
    .notEmpty().withMessage('Team name is required')
    .isString().withMessage('Team name must be a string')
    .trim(),
  body('institution')
    .notEmpty().withMessage('Institution is required')
    .isString().withMessage('Institution must be a string')
    .trim(),
  handleValidationErrors
];

const validateUpdateTeam = [
  body('teamName')
    .optional()
    .isString().withMessage('Team name must be a string')
    .trim(),
  body('institution')
    .optional()
    .isString().withMessage('Institution must be a string')
    .trim(),
  handleValidationErrors
];

module.exports = { validateCreateTeam, validateUpdateTeam };