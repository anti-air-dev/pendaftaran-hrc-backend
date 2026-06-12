const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 'fail', errors: errors.array() });
  }
  next();
};

const validateCreateTeamMember = [
  body('teamId').notEmpty().withMessage('Team ID is required').isInt(),
  body('fullName').notEmpty().withMessage('Full name is required').trim(),
  body('email').notEmpty().withMessage('Email is required').isEmail(),
  body('identityCardPath').notEmpty().withMessage('Identity card file is required'),
  
  // TAMBAHKAN VALIDASI BARU DI SINI:
  body('phoneNumber')
    .notEmpty().withMessage('Phone number (WhatsApp) is required')
    .isMobilePhone('id-ID').withMessage('Must be a valid Indonesian phone number'), // Validasi format nomor HP Indonesia
  body('identityNumber')
    .notEmpty().withMessage('Identity number (NIM/NISN/NIK) is required').trim(),
    
  body('roleInTeam').optional().isIn(['leader', 'member']),
  body('verificationStatus').optional().isIn(['pending', 'verified', 'rejected']),
  handleValidationErrors
];

const validateUpdateTeamMember = [
  param('id').isInt().withMessage('ID must be an integer'),
  body('fullName').optional().notEmpty().trim(),
  body('email').optional().isEmail(),
  body('identityCardPath').optional().notEmpty(),
  
  // TAMBAHKAN VALIDASI UPDATE DI SINI (Opsional/Boleh dikirim salah satu):
  body('phoneNumber').optional().isMobilePhone('id-ID').withMessage('Must be a valid Indonesian phone number'),
  body('identityNumber').optional().notEmpty().trim(),
  
  body('roleInTeam').optional().isIn(['leader', 'member']),
  body('verificationStatus').optional().isIn(['pending', 'verified', 'rejected']),
  handleValidationErrors
];

module.exports = { validateCreateTeamMember, validateUpdateTeamMember };