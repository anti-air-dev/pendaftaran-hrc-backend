const registrationRepository = require('../repositories/registration.repository');
const teamRepository = require('../repositories/team.repository');
const { sequelize, Team, TeamMember, Registration, SubCompetition, Payment } = require('../models');

class RegistrationService {
  async getAllRegistrations(filters) {
    return await registrationRepository.findAll(filters);
  }

  async getRegistrationById(id) {
    const registration = await registrationRepository.findById(id);
    if (!registration) throw new Error('Registration not found.');
    return registration;
  }

  async registerTeam(data) {
    const team = await teamRepository.findById(data.teamId);
    if (!team) throw new Error('Team not found.');

    const existingRegistration = await registrationRepository.findByTeamAndSubCompetition(
      data.teamId, 
      data.subCompetitionId
    );

    if (existingRegistration) {
      throw new Error('This team is already registered for this sub-competition.');
    }

    const registrationData = {
      teamId: data.teamId,
      subCompetitionId: data.subCompetitionId,
      registrationStatus: 'awaiting_payment'
    };

    return await registrationRepository.create(registrationData);
  }

  /**
   * Pendaftaran All-in-One: Mendukung File PDF, Phone Number, dan Identity Number
   */
  async registerNewTeamAndMembers(payload, files) {
    const { subCompetitionId, team, leader, members } = payload;
    
    const transaction = await sequelize.transaction();

    try {
      const subComp = await SubCompetition.findByPk(subCompetitionId, { transaction });
      if (!subComp) throw new Error('Sub Competition not found.');

      // Extract path file PDF ketua
      const leaderCardPath = files && files['leaderIdentityCard'] ? files['leaderIdentityCard'][0].path : null;
      // Extract array file PDF anggota
      const memberCards = files && files['memberIdentityCards'] ? files['memberIdentityCards'] : [];

      // 1. Buat Tim
      const newTeam = await Team.create({
        teamName: team.teamName,
        institution: team.institution
      }, { transaction });

      // 2. Buat Ketua Tim (Tambahan atribut baru + Path PDF)
      const newLeader = await TeamMember.create({
        teamId: newTeam.id,
        fullName: leader.fullName,
        email: leader.email,
        phoneNumber: leader.phoneNumber,         // BARU
        identityNumber: leader.identityNumber,   // BARU
        identityCardPath: leaderCardPath,         // Jalur File PDF terupload
        roleInTeam: 'leader',
        verificationStatus: 'pending'
      }, { transaction });

      // 3. Update Tim untuk memasukkan ID Ketua
      await newTeam.update({ leaderId: newLeader.id }, { transaction });

      // 4. Buat Anggota Tim beserta file PDF masing-masing (Mapping berdasarkan index)
      if (members && members.length > 0) {
        const membersData = members.map((member, index) => ({
          teamId: newTeam.id,
          fullName: member.fullName,
          email: member.email,
          phoneNumber: member.phoneNumber,         // BARU
          identityNumber: member.identityNumber,   // BARU
          identityCardPath: memberCards[index] ? memberCards[index].path : null, // PDF Anggota sesuai urutan
          roleInTeam: 'member',
          verificationStatus: 'pending'
        }));
        
        await TeamMember.bulkCreate(membersData, { transaction });
      }

      // 5. Daftarkan Tim ke Lomba
      const newRegistration = await Registration.create({
        teamId: newTeam.id,
        subCompetitionId: subCompetitionId,
        registrationStatus: 'awaiting_payment'
      }, { transaction });

      // 6. Buat Record Pembayaran
      const invoiceNumber = `INV-${Date.now()}-${newTeam.id}`; 
      await Payment.create({
        registrationId: newRegistration.id,
        transactionId: invoiceNumber,
        amount: subComp.registration_fee || 0, 
        paymentStatus: 'pending',
        paymentMethod: 'unselected'
      }, { transaction });

      await transaction.commit();

      return {
        ...newRegistration.toJSON(),
        invoiceNumber
      };

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
}

module.exports = new RegistrationService();