const paymentService = require('../services/payment.service');
const asyncHandler = require('../utils/asyncHandler');

class PaymentController {
  
  getAll = asyncHandler(async (req, res) => {
    const result = await paymentService.getAllPayments(req.query);
    return res.status(200).json({
      status: 'success',
      message: 'Payments retrieved successfully',
      data: result
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const payment = await paymentService.getPaymentById(id);
    return res.status(200).json({
      status: 'success',
      data: payment
    });
  });

  create = asyncHandler(async (req, res) => {
    const newPayment = await paymentService.createPayment(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Payment record created successfully',
      data: newPayment
    });
  });
  
  syncStatus = asyncHandler(async (req, res) => {
    const { transactionId } = req.body; // Dikirim dari frontend
    const result = await paymentService.verifyAndSyncPayment(transactionId);
    
    return res.status(200).json({ status: 'success', data: result });
  });

  handleWebhook = asyncHandler(async (req, res) => {
    console.log("=== MENERIMA WEBHOOK DARI MIDTRANS ===");
    
    // Kirim body notifikasi ke service untuk diproses
    const result = await paymentService.processWebhook(req.body);
    
    // Apapun hasilnya, selalu kirim status 200 ke Midtrans
    return res.status(200).json({
      status: 'success',
      message: 'Webhook Midtrans berhasil diproses',
      data: result
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedPayment = await paymentService.updatePayment(id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Payment record updated successfully',
      data: updatedPayment
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await paymentService.deletePayment(id);
    return res.status(200).json({
      status: 'success',
      message: response.message
    });
  });
}

module.exports = new PaymentController();