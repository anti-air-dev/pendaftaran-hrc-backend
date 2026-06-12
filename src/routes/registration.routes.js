const express = require('express');
const router = express.Router();

const registrationController = require('../controllers/registration.controller');
const { validateRegistration } = require('../validators/registration.validator');
const handleRegistrationUpload = require('../middlewares/upload-registration.middleware');

// Endpoint POST pendaftaran (Menggunakan Validator sebelum masuk ke Controller)

router.post('/', handleRegistrationUpload, validateRegistration, registrationController.register);

// Endpoint GET all
router.get('/', registrationController.getAll);

// Endpoint GET by ID
router.get('/:id', registrationController.getById);

module.exports = router;