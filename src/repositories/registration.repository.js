const { Registration, Team, SubCompetition, Payment } = require('../models');

class RegistrationRepository {
  /**
   * Mendapatkan semua pendaftaran (bisa difilter berdasarkan status)
   */
  async findAll(filters = {}) {
    return await Registration.findAll({
      where: filters,
      include: [
        { model: Team, as: 'team', attributes: ['id', 'teamName', 'institution'] },
        { model: SubCompetition, as: 'subCompetition', attributes: ['id', 'name', 'registration_fee'] },
        { model: Payment, as: 'payment', attributes: ['id', 'paymentStatus', 'amount'] }
      ],
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * Mendapatkan detail pendaftaran berdasarkan ID
   */
  async findById(id) {
    return await Registration.findByPk(id, {
      include: [
        { model: Team, as: 'team' },
        { model: SubCompetition, as: 'subCompetition' },
        { model: Payment, as: 'payment' }
      ]
    });
  }

  /**
   * Mengecek apakah sebuah tim sudah mendaftar di sub-lomba tertentu
   */
  async findByTeamAndSubCompetition(teamId, subCompetitionId) {
    return await Registration.findOne({
      where: { teamId, subCompetitionId }
    });
  }

  /**
   * Membuat pendaftaran baru
   */
  async create(registrationData) {
    return await Registration.create(registrationData);
  }

  /**
   * Memperbarui status pendaftaran (Optimized)
   */
  async update(id, updateData) {
    const [affectedRows] = await Registration.update(updateData, { where: { id } });
    if (affectedRows === 0) return null;
    return this.findById(id);
  }

  /**
   * Soft Delete pendaftaran (jika tim batal ikut)
   */
  async softDelete(id) {
    return await Registration.destroy({ where: { id } });
  }
}

module.exports = new RegistrationRepository();