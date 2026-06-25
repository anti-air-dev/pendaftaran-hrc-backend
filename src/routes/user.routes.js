const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { registerValidator, loginValidator, updateValidator, adminCreateValidator } = require('../validators/user.validator');
const { isAdmin } = require('../middlewares/role.middleware');

// --- Public Routes ---
// Tidak butuh login untuk daftar atau login
router.post('/register', registerValidator, userController.register);
router.post('/login', loginValidator, userController.login);

router.get('/', authMiddleware, isAdmin, userController.getAll);
router.post('/', authMiddleware, isAdmin, adminCreateValidator, userController.createByAdmin);
router.get('/:id', authMiddleware, userController.getProfile);
router.put('/:id', authMiddleware, updateValidator, userController.update);
router.put('/:id/change-password', authMiddleware, userController.changePassword);
router.delete('/:id', authMiddleware, isAdmin, userController.delete);
router.post('/:id/restore', authMiddleware, isAdmin, userController.restore);

// --- Protected Routes ---
// Menggunakan authMiddleware: Hanya user yang sudah login yang bisa akses
router.get('/profile/:id', authMiddleware, userController.getProfile);

module.exports = router;