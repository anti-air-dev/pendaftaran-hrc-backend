const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Memastikan folder penyimpanan kartu identitas ada
const identityCardDir = 'public/uploads/identity_cards';
if (!fs.existsSync(identityCardDir)) {
  fs.mkdirSync(identityCardDir, { recursive: true });
}

// Konfigurasi Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, identityCardDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter khusus PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error(`File ${file.fieldname} harus bertipe PDF!`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Field yang diterima: 1 untuk ketua, maksimal 10 untuk anggota
const uploadRegistrationFiles = upload.fields([
  { name: 'leaderIdentityCard', maxCount: 1 },
  { name: 'memberIdentityCards', maxCount: 10 }
]);

const handleRegistrationUpload = (req, res, next) => {
  uploadRegistrationFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ status: 'fail', message: `Multer Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ status: 'fail', message: err.message });
    }

    // Trik Cerdas: Parse string JSON dari field 'data' ke req.body agar bisa divalidasi express-validator
    if (req.body.data) {
      try {
        req.body = JSON.parse(req.body.data);
      } catch (parseError) {
        return res.status(400).json({ status: 'fail', message: 'Format field data JSON tidak valid' });
      }
    }

    next();
  });
};

module.exports = handleRegistrationUpload;