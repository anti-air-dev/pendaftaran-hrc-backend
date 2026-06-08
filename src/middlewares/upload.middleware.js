const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Buat folder jika belum ada
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const thumbnailDir = 'public/uploads/thumbnails';
const guidebookDir = 'public/uploads/guidebooks';
ensureDirExists(thumbnailDir);
ensureDirExists(guidebookDir);

// 2. Konfigurasi Penyimpanan (Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Tentukan folder berdasarkan field name
    if (file.fieldname === 'thumbnail') {
      cb(null, thumbnailDir);
    } else if (file.fieldname === 'guidebook') {
      cb(null, guidebookDir);
    } else {
      cb(new Error('Invalid field name'), 'public/uploads/');
    }
  },
  filename: (req, file, cb) => {
    // Format nama file: timestamp-namagenerate.ekstensi
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// 3. Filter Tipe File
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'thumbnail') {
    // Hanya izinkan gambar untuk thumbnail
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Thumbnail must be an image file (jpeg, jpg, png, etc.)'), false);
    }
  } else if (file.fieldname === 'guidebook') {
    // Hanya izinkan PDF untuk guidebook
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Guidebook must be a PDF file'), false);
    }
  } else {
    cb(null, false);
  }
};

// 4. Inisialisasi Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Batasan ukuran file: 5MB
  }
});

// Export middleware untuk menghandle multiple fields
const uploadSubCompetitionFiles = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'guidebook', maxCount: 1 }
]);

// Wrapper untuk menangani error multer agar response rapi
const handleUpload = (req, res, next) => {
  uploadSubCompetitionFiles(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ status: 'fail', message: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ status: 'fail', message: err.message });
    }
    next();
  });
};

module.exports = handleUpload;