const { Registration, Team, SubCompetition, Payment } = require('../models');

class RegistrationRepository {
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

  async findById(id) {
    return await Registration.findByPk(id, {
      include: [
        { model: Team, as: 'team' },
        { model: SubCompetition, as: 'subCompetition' },
        { model: Payment, as: 'payment' }
      ]
    });
  }

  async findByTeamAndSubCompetition(teamId, subCompetitionId) {
    return await Registration.findOne({
      where: { teamId, subCompetitionId }
    });
  }

  // Menerima options untuk transaction penulisan data berlapis
  async create(registrationData, options = {}) {
    return await Registration.create(registrationData, options);
  }

  async update(id, updateData, options = {}) {
    const [affectedRows] = await Registration.update(updateData, { where: { id }, ...options });
    if (affectedRows === 0) return null;
    return this.findById(id);
  }

  async softDelete(id, options = {}) {
    return await Registration.destroy({ where: { id }, ...options });
  }

  // async hardDelete(id, options = {force: true}) {
  //   return await Registration.destroy({ where: { id }, ...options });
  // }
}

module.exports = new RegistrationRepository();