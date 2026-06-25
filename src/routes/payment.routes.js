const express = require('express');
const router = express.Router();

const paymentController = require('../controllers/payment.controller');
const { validateCreatePayment, validateUpdatePayment } = require('../validators/payment.validator');
const authMiddleware = require('../middlewares/auth.middleware');

// GET /payments & POST /payments

router.post('/sync-status', authMiddleware, paymentController.syncStatus);
router.post('/webhook', paymentController.handleWebhook);

router.route('/')
  .get(paymentController.getAll)
  .post(paymentController.create);

// GET, PUT (Update), dan DELETE /payments/{id}
router.route('/:id')
  .get(paymentController.getById)
  .put(validateUpdatePayment, paymentController.update)
  .delete(paymentController.delete);

module.exports = router;