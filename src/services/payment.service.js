const paymentRepository = require('../repositories/payment.repository');
const registrationRepository = require('../repositories/registration.repository');

class PaymentService {
  /**
   * Mengambil semua pembayaran dengan format pagination
   */
  async getAllPayments(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {};
    if (query.paymentStatus) {
      filters.paymentStatus = query.paymentStatus;
    }

    const { count, rows } = await paymentRepository.findAndCountAll({
      where: filters,
      limit,
      offset
    });

    return {
      totalItems: count,
      payments: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit
    };
  }

  /**
   * Mengambil satu data pembayaran
   */
  async getPaymentById(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new Error('Payment record not found.');
    return payment;
  }

  /**
   * Membuat pembayaran baru secara manual
   */
  async createPayment(data) {
    // Validasi apakah pendaftaran yang dimaksud benar-benar ada
    const registration = await registrationRepository.findById(data.registrationId);
    if (!registration) throw new Error('Cannot create payment. Registration not found.');

    return await paymentRepository.create(data);
  }

  /**
   * Mengubah data pembayaran
   */
  async updatePayment(id, updateData) {
    const updatedPayment = await paymentRepository.update(id, updateData);
    if (!updatedPayment) throw new Error('Payment not found or no changes made.');
    return updatedPayment;
  }

  /**
   * Menghapus data pembayaran
   */
  async deletePayment(id) {
    const payment = await paymentRepository.findById(id);
    if (!payment) throw new Error('Payment record not found.');

    await paymentRepository.delete(id);
    return { message: 'Payment record successfully deleted.' };
  }
}

module.exports = new PaymentService();