const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');

// Import Middleware (Sesuaikan dengan file auth milikmu)
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

// Import Validators
const { validateCreateTeam, validateUpdateTeam } = require('../validators/team.validator');

// ==========================================
// ROUTES IMPLEMENTATION
// ==========================================

// Mendapatkan semua tim (Bisa diakses Admin/Committee untuk monitoring)
router.get('/', authMiddleware, authorizeRoles('admin', 'committee'), teamController.getAll);

// Mendapatkan detail satu tim berdasarkan ID
router.get('/:id', authMiddleware, teamController.getById);

// Membuat tim baru (Bisa diakses partisipan yang login)
router.post('/', authMiddleware, validateCreateTeam, teamController.create);

// Memperbarui data tim (Nama tim / Institusi)
router.put('/:id', authMiddleware, validateUpdateTeam, teamController.update);

// Menghapus/mengarsip tim
router.delete('/:id', authMiddleware, teamController.delete);

module.exports = router;