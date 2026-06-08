const { body, validationResult } = require('express-validator');

/**
 * Middleware internal untuk memeriksa apakah ada error dari aturan validasi di bawah.
 * Jika ada error, langsung kembalikan respon 400 Bad Request.
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Memformat error agar rapi dan mudah dibaca oleh Frontend
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
 * Aturan Validasi untuk MEMBUAT Kompetisi Baru (POST)
 */
const validateCreateCompetition = [
  body('title')
    .notEmpty().withMessage('Title is required')
    .isString().withMessage('Title must be a string')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),

  body('description')
    .notEmpty().withMessage('Description is required')
    .isString().withMessage('Description must be a string'),

  body('start_date')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid date format (YYYY-MM-DD)'),

  body('end_date')
    .notEmpty().withMessage('End date is required')
    .isISO8601().withMessage('End date must be a valid date format (YYYY-MM-DD)')
    .custom((value, { req }) => {
      // Logika kustom: Tanggal selesai tidak boleh sebelum tanggal mulai
      if (new Date(value) < new Date(req.body.start_date)) {
        throw new Error('End date cannot be earlier than start date');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be either draft, published, or archived'),

  validateResult // Eksekusi pengecekan error di akhir
];

/**
 * Aturan Validasi untuk MEMPERBARUI Kompetisi (PATCH)
 * Menggunakan .optional() karena saat update, user mungkin hanya mengirim beberapa field saja
 */
const validateUpdateCompetition = [
  body('title')
    .optional()
    .isString().withMessage('Title must be a string')
    .isLength({ min: 5 }).withMessage('Title must be at least 5 characters long'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('start_date')
    .optional()
    .isISO8601().withMessage('Start date must be a valid date format (YYYY-MM-DD)'),

  body('end_date')
    .optional()
    .isISO8601().withMessage('End date must be a valid date format (YYYY-MM-DD)')
    .custom((value, { req }) => {
      // Jika user memperbarui kedua tanggal sekaligus, lakukan validasi urutan tanggal
      if (req.body.start_date && new Date(value) < new Date(req.body.start_date)) {
        throw new Error('End date cannot be earlier than start date');
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Status must be either draft, published, or archived'),

  validateResult // Eksekusi pengecekan error di akhir
];

module.exports = {
  validateCreateCompetition,
  validateUpdateCompetition
};