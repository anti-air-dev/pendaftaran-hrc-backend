const {Registration, Team, Payment} = require('../models');
const paymentRepository = require('../repositories/payment.repository');
const registrationRepository = require('../repositories/registration.repository');
const midtransClient = require('midtrans-client');

// Inisialisasi Midtrans Snap
const snap = new  midtransClient.Snap({
  isProduction: false, // Ubah ke true jika sudah naik produksi
  serverKey: process.env.MIDTRANS_SERVER_KEY, // 👈 Pastikan diset di .env
  clientKey: process.env.MIDTRANS_CLIENT_KEY  // 👈 Pastikan diset di .env
});

class PaymentService {
  /**
   * Mengambil semua pembayaran dengan format pagination
   */

  

  async createPayment(payload) {
    const { registration_id, amount, payment_method } = payload;

    // 1. Validasi apakah registrasi ada
    const registration = await Registration.findByPk(registration_id, {
      include: [{ model: Team, as: 'team' }]
    });

    if (!registration) {
      throw new Error('Data registrasi tidak ditemukan');
    }

    // 2. Buat Transaction ID unik (misal: TRX-REGID-TIMESTAMP)
    const transactionId = `TRX-${registration_id}-${Date.now()}`;

    // 3. Siapkan Parameter untuk Midtrans
    const parameter = {
      transaction_details: {
        order_id: transactionId,
        gross_amount: Math.round(amount) // Midtrans butuh angka bulat
      },
      customer_details: {
        first_name: registration.team.teamName, // Opsional: Bisa diisi nama ketua/tim
      },
      // Opsional: Untuk menyesuaikan tampilan di Midtrans
      item_details: [{
        id: `REG-${registration_id}`,
        price: Math.round(amount),
        quantity: 1,
        name: `Pendaftaran Lomba - ${registration.team.teamName}`
      }]
    };

    // 4. Minta Snap Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    const snapToken = transaction.token;

    // 5. Simpan data ke database tabel `payments`
    const newPayment = await Payment.create({
      registrationId: registration_id,
      transactionId: transactionId,
      amount: amount,
      paymentMethod: payment_method || 'midtrans',
      paymentStatus: 'pending' // Status awal selalu pending
    });

    // 6. Kembalikan data payment beserta tokennya
    return {
      payment: newPayment,
      token: snapToken
    };
  }

  async processWebhook(notificationBody) {
    try {
      // 1. Verifikasi notifikasi di dalam block try
      const statusResponse = await snap.transaction.notification(notificationBody);

      const orderId = statusResponse.order_id;               
      const transactionStatus = statusResponse.transaction_status; 
      const fraudStatus = statusResponse.fraud_status;

      console.log(`[Webhook Log] Order ID: ${orderId} | Status Midtrans: ${transactionStatus}`);

      // 2. Cari data pembayaran di database berdasarkan transactionId
      const payment = await Payment.findOne({ where: { transactionId: orderId } });
      
      if (!payment) {
        console.log(`[Webhook Log] Transaksi ${orderId} tidak ditemukan di database. Mengabaikan.`);
        return { success: true, message: 'Transaction not found in DB' };
      }

      // 3. Tentukan status baru untuk database
      let dbPaymentStatus = 'pending';
      let dbRegistrationStatus = 'pending'; 

      if (transactionStatus === 'capture') {
        if (fraudStatus === 'challenge') {
          dbPaymentStatus = 'challenge';
        } else if (fraudStatus === 'accept') {
          dbPaymentStatus = 'success';
          dbRegistrationStatus = 'completed'; 
        }
      } else if (transactionStatus === 'settlement') {
        dbPaymentStatus = 'success';
        dbRegistrationStatus = 'completed'; 
      } else if (transactionStatus === 'cancel' || transactionStatus === 'deny' || transactionStatus === 'expire') {
        dbPaymentStatus = 'failed';
        dbRegistrationStatus = 'failed';
      } else if (transactionStatus === 'pending') {
        dbPaymentStatus = 'pending';
      }

      // 4. Update status di tabel Payments
      payment.paymentStatus = dbPaymentStatus;
      if (dbPaymentStatus === 'success') {
        payment.paidAt = new Date(); 
      }
      await payment.save();
      console.log(`[Database Update] Tabel Payments sukses diupdate: ${dbPaymentStatus}`);

      // 5. Update status di tabel Registrations
      await Registration.update(
        { registrationStatus: dbRegistrationStatus === 'success' ? 'completed' : dbRegistrationStatus },
        { where: { id: payment.registrationId } }
      );
      console.log(`[Database Update] Tabel Registrations sukses diupdate: ${dbRegistrationStatus}`);

      return { orderId, paymentStatus: dbPaymentStatus, registrationStatus: dbRegistrationStatus };

    } catch (error) {
      // 🚨 JIKA MIDTRANS MENGIRIMKAN ERROR 404 (DATA PALSU/TES)
      if (error.message && error.message.includes('404')) {
        console.log("[Webhook Log] Mendapat 404 dari Midtrans. Ini adalah notifikasi dummy/tes dari dashboard. Aman untuk diabaikan.");
        return { success: true, message: 'Dummy/Test notification ignored safely.' };
      }

      // Jika errornya karena hal lain, log kodenya
      console.error("[Webhook Error] Terjadi kesalahan:", error.message);
      throw error;
    }
  }

  async verifyAndSyncPayment(transactionId) {
    try {
      // 1. Minta status aslinya langsung ke server Midtrans
      const statusResponse = await snap.transaction.status(transactionId);
      
      const { transaction_status, fraud_status } = statusResponse;

      // 2. Cari transaksi di DB kita
      const payment = await Payment.findOne({ where: { transactionId } });
      if (!payment) throw new Error('Payment tidak ditemukan');

      // 3. Logika update status (mirip webhook)
      if (transaction_status === 'settlement' || (transaction_status === 'capture' && fraud_status === 'accept')) {
        
        // Update tabel Payment
        payment.paymentStatus = 'success';
        payment.paidAt = new Date();
        await payment.save();

        // Update tabel Registration
        await Registration.update(
          { registrationStatus: 'completed' }, // sesuaikan nama kolom
          { where: { id: payment.registrationId } }
        );

        return { success: true, message: 'Pembayaran valid dan berhasil diupdate' };
      }

      return { success: false, message: 'Pembayaran belum selesai atau gagal di Midtrans' };
    } catch (error) {
      throw new Error('Gagal memverifikasi status ke Midtrans: ' + error.message);
    }
  }


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
  // async createPayment(data) {
  //   // Validasi apakah pendaftaran yang dimaksud benar-benar ada
  //   const registration = await registrationRepository.findById(data.registrationId);
  //   if (!registration) throw new Error('Cannot create payment. Registration not found.');

  //   return await paymentRepository.create(data);
  // }

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