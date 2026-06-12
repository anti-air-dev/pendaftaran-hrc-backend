const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const { validateCreatePayment, validateUpdatePayment } = require('../validators/payment.validator');

// GET /payments & POST /payments
router.route('/')
  .get(paymentController.getAll)
  .post(validateCreatePayment, paymentController.create);

// GET, PUT (Update), dan DELETE /payments/{id}
router.route('/:id')
  .get(paymentController.getById)
  .put(validateUpdatePayment, paymentController.update)
  .delete(paymentController.delete);

module.exports = router;