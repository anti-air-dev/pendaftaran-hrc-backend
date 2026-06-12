const { Payment, Registration, Team } = require('../models');

class PaymentRepository {
  /**
   * Mendapatkan semua data pembayaran (dengan pagination & filter)
   */
  async findAndCountAll(options = {}) {
    const { limit, offset, where } = options;
    return await Payment.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        {
          model: Registration,
          as: 'registration',
          attributes: ['id', 'registrationStatus'],
          include: [{ model: Team, as: 'team', attributes: ['id', 'teamName'] }]
        }
      ],
      distinct: true, // Mencegah bug salah hitung totalItems akibat JOIN
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Mendapatkan detail pembayaran berdasarkan ID
   */
  async findById(id) {
    return await Payment.findByPk(id, {
      include: [
        { model: Registration, as: 'registration' }
      ]
    });
  }

  /**
   * Membuat data pembayaran baru
   */
  async create(paymentData) {
    return await Payment.create(paymentData);
  }

  /**
   * Memperbarui data pembayaran (Optimized)
   */
  async update(id, updateData) {
    const [affectedRows] = await Payment.update(updateData, { where: { id } });
    if (affectedRows === 0) return null;
    return await this.findById(id);
  }

  /**
   * Menghapus data pembayaran
   */
  async delete(id) {
    return await Payment.destroy({ where: { id } });
  }
}

module.exports = new PaymentRepository();