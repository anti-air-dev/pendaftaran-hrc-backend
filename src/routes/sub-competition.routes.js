const express = require('express');
const router = express.Router();
const subCompetitionController = require('../controllers/sub-competition.controller');

// Import Middleware Authentication & Authorization
const authMiddleware = require('../middlewares/auth.middleware');
const handleUpload = require('../middlewares/upload.middleware');
const { isAdmin, authorizeRoles } = require('../middlewares/role.middleware');

// Import Validators
const { 
  validateCreateSubCompetition, 
  validateUpdateSubCompetition 
} = require('../validators/sub-competition.validator');

// ==========================================
// PUBLIC ROUTES
// ==========================================
router.get('/', subCompetitionController.getAll);
router.get('/:id', subCompetitionController.getById);
router.get('/detail/:slug', subCompetitionController.getBySlug);

// ==========================================
// PROTECTED ROUTES
// ==========================================
// CREATE
router.post('/', 
  authMiddleware, 
  isAdmin, 
  handleUpload, // 1. Proses file & body form-data
  validateCreateSubCompetition, // 2. Validasi body teks yang sudah diekstrak multer
  subCompetitionController.create // 3. Masuk ke controller
);

// UPDATE
router.put('/:id', 
  authMiddleware, 
  authorizeRoles('admin', 'committee'), 
  handleUpload, 
  validateUpdateSubCompetition, 
  subCompetitionController.update
);

// DELETE & RESTORE: Hanya Admin
router.delete('/:id', authMiddleware, isAdmin, subCompetitionController.delete);
router.post('/:id/restore', authMiddleware, isAdmin, subCompetitionController.restore);

module.exports = router;