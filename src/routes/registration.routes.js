const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registration.controller');
const { validateRegistration } = require('../validators/registration.validator');
const handleRegistrationUpload = require('../middlewares/upload-registration.middleware');
const authMiddleware = require('../middlewares/auth.middleware');

// Middleware pembantu untuk menyatukan text field multipart ke req.body pencocokan validator
const parseRegistrationPayload = (req, res, next) => {
  if (req.body && typeof req.body.payload === 'string') {
    try {
      req.body = { ...req.body, ...JSON.parse(req.body.payload) };
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid JSON payload format.' });
    }
  }
  next();
};

// POST - Menggunakan urutan: Upload -> Parse JSON -> Validasi Schema -> Controller
router.post('/', authMiddleware, handleRegistrationUpload, parseRegistrationPayload, validateRegistration, registrationController.register);

// GET All
router.get('/', registrationController.getAll);

router.get('/my-registrations', authMiddleware, registrationController.getMyRegistrations);
router.get('/my-registrations/:id', authMiddleware, registrationController.getMyRegistrationDetail);


// GET by ID
router.get('/:id', registrationController.getById);

// PUT Update
router.put('/:id', registrationController.update);

// DELETE
router.delete('/:id', registrationController.delete);

module.exports = router;