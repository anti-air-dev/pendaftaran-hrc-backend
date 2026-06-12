const teamMemberRepository = require('../repositories/team-member.repository');
const teamRepository = require('../repositories/team.repository');

class TeamMemberService {
  /**
   * Mendapatkan semua anggota tim (bisa difilter via query)
   */
  async getAllTeamMembers(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const filters = {};
    if (query.teamId) filters.teamId = query.teamId;
    if (query.roleInTeam) filters.roleInTeam = query.roleInTeam;

    const { count, rows } = await teamMemberRepository.findAndCountAll({
      where: filters,
      limit,
      offset
    });

    return {
      totalItems: count,
      teamMembers: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      limit
    };
  }

  /**
   * Mendapatkan detail satu anggota
   */
  async getMemberById(id) {
    const member = await teamMemberRepository.findById(id);
    if (!member) throw new Error('Team member not found.');
    return member;
  }

  /**
   * Menambahkan anggota baru ke tim via endpoint
   */
  async addMember(data) {
    const team = await teamRepository.findById(data.teamId);
    if (!team) throw new Error('Cannot add member. Team not found.');

    const memberData = {
      ...data,
      roleInTeam: data.roleInTeam || 'member', 
      verificationStatus: data.verificationStatus || 'pending'
    };

    return await teamMemberRepository.create(memberData);
  }

  /**
   * Memperbarui data anggota
   */
  async updateMember(id, updateData) {
    const updatedMember = await teamMemberRepository.update(id, updateData);
    if (!updatedMember) throw new Error('Team member not found or no changes made.');
    return updatedMember;
  }

  /**
   * Menghapus anggota dari tim
   */
  async removeMember(id) {
    const member = await teamMemberRepository.findById(id);
    if (!member) throw new Error('Team member not found.');

    // Aturan Bisnis: Tidak boleh menghapus ketua langsung dari endpoint ini
    if (member.roleInTeam === 'leader') {
      throw new Error('Cannot delete the team leader. Change the leader from Team settings first.');
    }

    await teamMemberRepository.softDelete(id);
    return { message: 'Team member successfully removed.' };
  }
}

module.exports = new TeamMemberService();