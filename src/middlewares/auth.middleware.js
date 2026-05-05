const STATIC_TOKEN = 'SECRET123';

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  // cek apakah header ada
  if (!authHeader) {
    return res.status(401).json({
      message: 'Unauthorized: No token provided'
    });
  }

  // format: Bearer TOKEN
  const token = authHeader.split(' ')[1];

  if (token !== STATIC_TOKEN) {
    return res.status(403).json({
      message: 'Forbidden: Invalid token'
    });
  }

  next();
};