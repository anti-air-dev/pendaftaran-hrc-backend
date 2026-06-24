const { body, validationResult } = require('express-validator');

// Fungsi pembantu untuk menangani hasil validasi
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  // Ambil pesan error pertama saja agar simpel bagi frontend
  return res.status(400).json({
    status: 'fail',
    message: errors.array()[0].msg,
    errors: errors.array()
  });
};

const registerValidator = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .trim()
    .escape(),
  
  body('username')
    .notEmpty().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must be alphanumeric')
    .trim()
    .escape(),

  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .trim()
    .escape(),

  // Tambahkan validasi konfirmasi password di sini
  body('password_confirmation')
    .notEmpty().withMessage('Password confirmation is required')
    .trim()
    .escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  body('role')
    .optional()
    .isIn(['admin', 'committee', 'participant']).withMessage('Invalid role'),
  
  validate
];

const updateValidator = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .trim()
    .escape(),
  
  body('username')
    .notEmpty().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must be alphanumeric')
    .trim()
    .escape(),

  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('role')
    .optional()
    .isIn(['admin', 'committee', 'participant']).withMessage('Invalid role'),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'suspended', 'unverified']).withMessage('Invalid status'),

  // TAMBAHKAN VALIDASI PASSWORD OPSIONAL DI BAWAH INI
  body('password')
    .optional({ checkFalsy: true }) // Diabaikan jika string kosong atau tidak dikirim
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
    .matches(/\d/).withMessage('New password must contain at least one number')
    .trim()
    .escape(),

  body('password_confirmation')
    .optional({ checkFalsy: true })
    .trim()
    .escape()
    .custom((value, { req }) => {
      // Jika password diisi, maka konfirmasi password wajib cocok
      if (req.body.password && value !== req.body.password) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  validate
];

const loginValidator = [
  body('email')
    .isEmail().withMessage('Please provide a valid email'),
  
  body('password')
    .notEmpty().withMessage('Password cannot be empty')
    .trim()
    .escape(),
  
  validate
];

const adminCreateValidator = [
  body('full_name')
    .notEmpty().withMessage('Full name is required')
    .isLength({ min: 3 }).withMessage('Full name must be at least 3 characters')
    .trim().escape(),
  
  body('username')
    .notEmpty().withMessage('Username is required')
    .isAlphanumeric().withMessage('Username must be alphanumeric')
    .trim().escape(),

  body('email')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .trim().escape(),

  body('password_confirmation')
    .notEmpty().withMessage('Password confirmation is required')
    .trim().escape()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),

  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['admin', 'committee', 'participant']).withMessage('Invalid role'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['active', 'inactive', 'suspended', 'unverified']).withMessage('Invalid status'),
  
  validate
];

module.exports = { registerValidator, updateValidator, loginValidator, adminCreateValidator };