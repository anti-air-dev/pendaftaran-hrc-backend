/**
 * Membungkus fungsi async untuk menangkap error secara otomatis 
 * dan meneruskannya ke global error handler Express.
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;