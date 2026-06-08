const express = require('express');
const router = express.Router();

const competitionController = require('../controllers/competition.controller');

// Import middleware keamanan Anda
const authMiddleware = require('../middlewares/auth.middleware');
const { isAdmin, authorizeRoles } = require('../middlewares/role.middleware');
const { validateCreateCompetition, validateUpdateCompetition } = require('../validators/competition.validator');

// ==========================================
// PUBLIC ROUTES (Siapa saja bisa mengakses, termasuk pengunjung yang belum login)
// ==========================================
router.get('/', competitionController.getAll);
router.get('/:id', competitionController.getById);

// ==========================================
// PROTECTED ROUTES (Wajib Login & Memiliki Role Tertentu)
// ==========================================

// Hanya ADMIN yang bisa membuat kompetisi baru
router.post('/', authMiddleware, isAdmin, validateCreateCompetition, competitionController.create);

// ADMIN atau COMMITTEE bisa memperbarui data kompetisi
router.put('/:id', authMiddleware, authorizeRoles('admin', 'committee'), validateUpdateCompetition, competitionController.update);

// Hanya ADMIN yang bisa menghapus (soft delete) kompetisi
router.delete('/:id', authMiddleware, isAdmin, competitionController.delete);

// Hanya ADMIN yang bisa melakukan restore kompetisi
router.post('/:id/restore', authMiddleware, isAdmin, competitionController.restore);

module.exports = router;