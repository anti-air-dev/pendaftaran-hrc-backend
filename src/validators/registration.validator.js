const { body, validationResult } = require('express-validator');

// Middleware ekstraktor: Mengubah string payload menjadi objek agar bisa divalidasi
const extractPayload = (req, res, next) => {
  if (req.body && typeof req.body.payload === 'string') {
    try {
      const parsedPayload = JSON.parse(req.body.payload);
      // Pindahkan semua properti dari parsedPayload ke req.body
      Object.assign(req.body, parsedPayload);
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: 'Format payload tidak valid (harus berupa JSON).'
      });
    }
  }
  next();
};

const validateRegistration = [
  // 0. Jalankan ekstraktor pertama kali!
  extractPayload,

  // -- Opsional: Tambahkan validasi User ID jika kamu mengirimkannya dari frontend/testing --
  // body('userId').notEmpty().withMessage('User ID is required').isInt(),

  // 1. Validasi Sub Lomba
  body('subCompetitionId')
    .notEmpty().withMessage('Sub Competition ID is required')
    .isInt().withMessage('Sub Competition ID must be a number'),

  // 2. Validasi Data Tim
  body('team.teamName').notEmpty().withMessage('Team name is required').trim(),
  body('team.institution').notEmpty().withMessage('Institution is required').trim(),

  // 3. Validasi Data Ketua (Leader)
  body('leader.fullName').notEmpty().withMessage('Leader full name is required').trim(),
  body('leader.email').isEmail().withMessage('Leader must have a valid email'),
  body('leader.phoneNumber')
    .notEmpty().withMessage('Leader phone number is required')
    .isMobilePhone('id-ID').withMessage('Leader phone number must be a valid Indonesian number'),
  body('leader.identityNumber').notEmpty().withMessage('Leader identity number (NIM/NISN) is required').trim(),
  
  // Validasi Kustom: File KTP Ketua
  body('leader').custom((value, { req }) => {
    if (!req.files || !req.files['leaderIdentityCard']) {
      throw new Error('File PDF Kartu Identitas Ketua wajib diunggah');
    }
    return true;
  }),

  // 4. Validasi Data Anggota (Members)
  body('members').optional().isArray().withMessage('Members must be an array'),
  body('members.*.fullName').notEmpty().withMessage('Member full name is required').trim(),
  body('members.*.email').isEmail().withMessage('Member must have a valid email'),
  body('members.*.phoneNumber')
    .notEmpty().withMessage('Member phone number is required')
    .isMobilePhone('id-ID').withMessage('Member phone number must be a valid Indonesian number'),
  body('members.*.identityNumber').notEmpty().withMessage('Member identity number is required').trim(),

  // Validasi Kustom: Sinkronisasi jumlah data anggota dengan jumlah file
  body('members').optional().custom((value, { req }) => {
    const memberCount = value ? value.length : 0;
    const fileCount = req.files && req.files['memberIdentityCards'] ? req.files['memberIdentityCards'].length : 0;
    
    if (memberCount !== fileCount) {
      throw new Error(`Jumlah file PDF anggota tidak cocok! Anda mengirim ${memberCount} data anggota tetapi hanya mengunggah ${fileCount} PDF.`);
    }
    return true;
  }),

  // 5. Middleware penangkap error
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false, // Diseragamkan dengan format controller (success: false)
        message: 'Validation Error',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = { validateRegistration };