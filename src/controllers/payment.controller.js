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