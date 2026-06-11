const teamRepository = require('../repositories/team.repository');

class TeamService {
  /**
   * Logika mendapatkan list tim (Pagination & Search)
   */
  async getTeams(page = 1, limit = 10, search = '') {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const currentPage = parsedPage > 0 ? parsedPage : 1;
    const currentLimit = parsedLimit > 0 ? parsedLimit : 10;
    const offset = (currentPage - 1) * currentLimit;

    const { count, rows } = await teamRepository.findWithPagination(currentLimit, offset, search);
    const totalPages = Math.ceil(count / currentLimit);

    return {
      totalItems: count,
      teams: rows,
      totalPages,
      currentPage,
      limit: currentLimit,
      searchQuery: search
    };
  }

  /**
   * Logika mendapatkan detail satu tim
   */
  async getTeamById(id) {
    const team = await teamRepository.findById(id);
    if (!team) throw new Error('Team not found.');
    return team;
  }

  /**
   * Logika membuat tim baru (Termasuk aturan bisnis)
   */
  async createTeam(data) {
    // Aturan Bisnis: Cek apakah user tersebut sudah mendaftarkan tim sebagai ketua
    if (data.leaderId) {
        const isLeaderExists = await teamRepository.findByLeaderId(data.leaderId);
        if (isLeaderExists) {
          throw new Error('This user is already leading another team. One user can only create one team.');
        }
    }

    return await teamRepository.create(data);
  }

  /**
   * Logika memperbarui data tim
   */
  async updateTeam(id, updateData) {
    const updatedTeam = await teamRepository.update(id, updateData);
    if (!updatedTeam) throw new Error('Team not found or no changes made.');
    return updatedTeam;
  }

  /**
   * Logika Soft Delete tim
   */
  async deleteTeam(id) {
    const deleted = await teamRepository.softDelete(id);
    if (!deleted) throw new Error('Team not found or already deleted.');
    return { message: 'Team has been successfully archived.' };
  }
}

module.exports = new TeamService();