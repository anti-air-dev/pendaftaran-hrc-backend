const { body } = require('express-validator');

exports.createCompetitionValidator = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters')
    .trim()
    .escape(),

  body('organizer')
    .notEmpty().withMessage('Organizer is required')
    .isLength({ min: 3 }).withMessage('Organizer must be at least 3 characters')
    .trim()
    .escape(),

  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Date must be a valid date')
    .toDate(), // convert ke Date object

  body('location')
    .notEmpty().withMessage('Location is required')
    .isLength({ min: 3 }).withMessage('Location must be at least 3 characters')
    .trim()
    .escape(),
];