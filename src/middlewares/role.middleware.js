/**
 * Middleware khusus untuk memastikan user adalah Admin
 */
const isAdmin = (req, res, next) => {
  // 1. Pastikan req.user sudah diisi oleh authMiddleware sebelumnya
  if (!req.user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized. User data not found.'
    });
  }

  // 2. Cek apakah role dari token JWT adalah 'admin'
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'fail',
      message: 'Access denied. Admin privileges required.'
    });
  }

  // 3. Jika lolos, lanjutkan ke controller
  next();
};

/**
 * Middleware dinamis untuk mengizinkan beberapa role sekaligus
 * Penggunaan di route: authorizeRoles('admin', 'committee')
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Pastikan req.user sudah diisi oleh authMiddleware
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. User data not found.'
      });
    }

    // 2. Cek apakah role user ada di dalam array allowedRoles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'Access denied. You do not have permission to perform this action.'
      });
    }

    // 3. Jika lolos, lanjutkan ke controller
    next();
  };
};

module.exports = {
  isAdmin,
  authorizeRoles
};