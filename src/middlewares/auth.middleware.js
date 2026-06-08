const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

const authMiddleware = (req, res, next) => {
  // 1. Ambil token dari header 'Authorization'
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // 2. Verifikasi token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. Simpan data user dari token ke dalam object 'req' agar bisa dipakai di controller
    req.user = decoded; 
    next(); // Lanjut ke proses berikutnya
  } catch (error) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token.'
    });
  }
};

module.exports = authMiddleware;
