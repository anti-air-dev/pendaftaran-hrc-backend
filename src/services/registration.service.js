const registrationRepository = require('../repositories/registration.repository');
const teamRepository = require('../repositories/team.repository');
const { sequelize, Team, TeamMember, SubCompetition, Payment } = require('../models');

class RegistrationService {
  async getAllRegistrations(filters) {
    return await registrationRepository.findAll(filters);
  }

  async getRegistrationById(id) {
    const registration = await registrationRepository.findById(id);
    if (!registration) throw new Error('Registration not found.');
    return registration;
  }

  async registerNewTeamAndMembers(payload, files) {
    const { subCompetitionId, team, leader, members } = payload;
    const transaction = await sequelize.transaction();

    try {
      const subComp = await SubCompetition.findByPk(subCompetitionId, { transaction });
      if (!subComp) throw new Error('Sub Competition not found.');

      const leaderCardPath = files && files['leaderIdentityCard'] ? files['leaderIdentityCard'][0].path : null;
      const memberCards = files && files['memberIdentityCards'] ? files['memberIdentityCards'] : [];

      // 1. Buat Tim
      const newTeam = await Team.create({
        teamName: team.teamName,
        institution: team.institution
      }, { transaction });

      // 2. Buat Ketua Tim
      const newLeader = await TeamMember.create({
        teamId: newTeam.id,
        fullName: leader.fullName,
        email: leader.email,
        phoneNumber: leader.phoneNumber,         
        identityNumber: leader.identityNumber,   
        identityCardPath: leaderCardPath,         
        roleInTeam: 'leader',
        verificationStatus: 'pending'
      }, { transaction });

      await newTeam.update({ leaderId: newLeader.id }, { transaction });

      // 3. Buat Anggota Tim
      if (members && members.length > 0) {
        const membersData = members.map((member, index) => ({
          teamId: newTeam.id,
          fullName: member.fullName,
          email: member.email,
          phoneNumber: member.phoneNumber,         
          identityNumber: member.identityNumber,   
          identityCardPath: memberCards[index] ? memberCards[index].path : null, 
          roleInTeam: 'member',
          verificationStatus: 'pending'
        }));
        await TeamMember.bulkCreate(membersData, { transaction });
      }

      // 4. Daftarkan Tim ke Lomba (Lewat Repository)
      const newRegistration = await registrationRepository.create({
        teamId: newTeam.id,
        subCompetitionId: subCompetitionId,
        registrationStatus: 'awaiting_payment'
      }, { transaction });

      // 5. Record Pembayaran
      const invoiceNumber = `INV-${Date.now()}-${newTeam.id}`; 
      await Payment.create({
        registrationId: newRegistration.id,
        transactionId: invoiceNumber,
        amount: subComp.registration_fee || 0, 
        paymentStatus: 'pending',
        paymentMethod: 'unselected'
      }, { transaction });

      await transaction.commit();
      return { ...newRegistration.toJSON(), invoiceNumber };

    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateStatus(id, newStatus) {
    const updatedRegistration = await registrationRepository.update(id, { registrationStatus: newStatus });
    if (!updatedRegistration) throw new Error('Registration not found.');
    return updatedRegistration;
  }

  async deleteRegistration(id) {
    const registration = await registrationRepository.findById(id);
    if (!registration) throw new Error('Registration not found.');
    return await registrationRepository.softDelete(id);
  }
}

module.exports = new RegistrationService();