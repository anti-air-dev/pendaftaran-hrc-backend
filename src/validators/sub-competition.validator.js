const { body, validationResult } = require('express-validator');

const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    return res.status(400).json({
      status: 'fail',
      message: 'Validation error',
      errors: formattedErrors
    });
  }
  next();
};

/**
 * Aturan Validasi untuk CREATE Sub-Kompetisi (POST)
 */
const validateCreateSubCompetition = [
  body('competition_id')
    .notEmpty().withMessage('Competition ID is required')
    .isInt().withMessage('Competition ID must be a valid integer number'),

  body('name')
    .notEmpty().withMessage('Name is required')
    .isString().withMessage('Name must be a string')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn(['student', 'college', 'general']).withMessage('Category must be student, college, or general'),

  body('min_participants')
    .notEmpty().withMessage('Minimum participants is required')
    .isInt({ min: 1 }).withMessage('Minimum participants must be at least 1'),

  body('max_participants')
    .notEmpty().withMessage('Maximum participants is required')
    .isInt({ min: 1 }).withMessage('Maximum participants must be at least 1')
    .custom((value, { req }) => {
      if (parseInt(value) < parseInt(req.body.min_participants)) {
        throw new Error('Maximum participants cannot be less than minimum participants');
      }
      return true;
    }),

  body('registration_fee')
    .notEmpty().withMessage('Registration fee is required')
    .isFloat({ min: 0 }).withMessage('Registration fee must be a valid number (0 or higher)'),

  body('registration_start')
    .notEmpty().withMessage('Registration start date is required')
    .isISO8601().withMessage('Valid date format is required (YYYY-MM-DD or ISO 8601)'),

  body('registration_end')
    .notEmpty().withMessage('Registration end date is required')
    .isISO8601().withMessage('Valid date format is required')
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.registration_start)) {
        throw new Error('Registration end date cannot be earlier than start date');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['open', 'closed', 'maintenance']).withMessage('Status must be open, closed, or maintenance'),

  // ==========================================
  // VALIDASI FILE (Mengecek isi dari req.files)
  // ==========================================
  body('thumbnail')
    .custom((value, { req }) => {
      if (!req.files || !req.files['thumbnail']) {
        throw new Error('Thumbnail image file is required');
      }
      return true;
    }),

  body('guidebook')
    .custom((value, { req }) => {
      if (!req.files || !req.files['guidebook']) {
        throw new Error('Guidebook PDF file is required');
      }
      return true;
    })
    .optional(),

  validateResult
];

/**
 * Aturan Validasi untuk UPDATE Sub-Kompetisi (PATCH)
 */
const validateUpdateSubCompetition = [
  body('competition_id').optional().isInt(),
  body('name').optional().isString().isLength({ min: 3 }),
  body('category').optional().isIn(['student', 'college', 'general']),
  body('min_participants').optional().isInt({ min: 1 }),
  body('max_participants').optional().isInt({ min: 1 }).custom((value, { req }) => {
    if (req.body.min_participants && parseInt(value) < parseInt(req.body.min_participants)) {
      throw new Error('Maximum participants cannot be less than minimum participants');
    }
    return true;
  }),
  body('registration_fee').optional().isFloat({ min: 0 }),
  body('registration_start').optional().isISO8601(),
  body('registration_end').optional().isISO8601().custom((value, { req }) => {
    if (req.body.registration_start && new Date(value) < new Date(req.body.registration_start)) {
      throw new Error('Registration end date cannot be earlier than start date');
    }
    return true;
  }),
  body('status').optional().isIn(['open', 'closed', 'maintenance']),
  
  // Catatan: Pada proses UPDATE, file thumbnail dan guidebook biasanya bersifat opsional 
  // (user tidak harus mengupload file baru jika hanya ingin mengubah nama lomba).
  // Oleh karena itu, kita tidak perlu menambahkan pengecekan "required" untuk file di sini.
  
  validateResult
];

module.exports = {
  validateCreateSubCompetition,
  validateUpdateSubCompetition
};