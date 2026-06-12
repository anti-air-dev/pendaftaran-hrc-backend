const { body, validationResult } = require('express-validator');

const validateRegistration = [
  // 1. Validasi Sub Lomba
  body('subCompetitionId')
    .notEmpty().withMessage('Sub Competition ID is required')
    .isInt().withMessage('Sub Competition ID must be a number'),

  // 2. Validasi Data Tim
  body('team.teamName').notEmpty().withMessage('Team name is required').trim(),
  body('team.institution').notEmpty().withMessage('Institution is required').trim(),

  // 3. Validasi Data Ketua (Leader) + Atribut Baru
  body('leader.fullName').notEmpty().withMessage('Leader full name is required').trim(),
  body('leader.email').isEmail().withMessage('Leader must have a valid email'),
  body('leader.phoneNumber')
    .notEmpty().withMessage('Leader phone number is required')
    .isMobilePhone('id-ID').withMessage('Leader phone number must be a valid Indonesian number'),
  body('leader.identityNumber').notEmpty().withMessage('Leader identity number (NIM/NISN) is required').trim(),
  
  // Validasi Kustom: Memastikan file PDF Ketua ada di req.files
  body('leader').custom((value, { req }) => {
    if (!req.files || !req.files['leaderIdentityCard']) {
      throw new Error('File PDF Kartu Identitas Ketua wajib diunggah');
    }
    return true;
  }),

  // 4. Validasi Data Anggota (Members) + Atribut Baru
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*.fullName').notEmpty().withMessage('Member full name is required').trim(),
  body('members.*.email').isEmail().withMessage('Member must have a valid email'),
  body('members.*.phoneNumber')
    .notEmpty().withMessage('Member phone number is required')
    .isMobilePhone('id-ID').withMessage('Member phone number must be a valid Indonesian number'),
  body('members.*.identityNumber').notEmpty().withMessage('Member identity number is required').trim(),

  // Validasi Kustom: Memastikan jumlah file PDF anggota sama dengan jumlah data teks anggota
  body('members').optional().custom((value, { req }) => {
    const memberCount = value ? value.length : 0;
    const fileCount = req.files && req.files['memberIdentityCards'] ? req.files['memberIdentityCards'].length : 0;
    
    if (memberCount !== fileCount) {
      throw new Error(`Jumlah file PDF anggota tidak cocok! Anda mengirim ${memberCount} data anggota tetapi hanya mengunggah ${fileCount} PDF.`);
    }
    return true;
  }),

  // Middleware penangkap error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'fail',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateRegistration };