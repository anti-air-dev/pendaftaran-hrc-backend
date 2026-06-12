const { Team, User, TeamMember } = require('../models');
const { Op } = require('sequelize');

class TeamRepository {
  /**
   * Mengambil list tim dengan Pagination dan Search (berdasarkan nama tim atau institusi)
   */
  async findWithPagination(limit, offset, search = '') {
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { teamName: { [Op.like]: `%${search}%` } },
        { institution: { [Op.like]: `%${search}%` } }
      ];
    }

    return await Team.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      distinct: true,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: TeamMember,
          as: 'leader',
          attributes: ['id', 'full_name', 'email'] // Ambil data ketua yang penting saja
        },
        {
          model: TeamMember,
          as: 'members',
          attributes: ['id', 'full_name', 'email', 'roleInTeam', 'verificationStatus']
        }
      ]
    });
  }

  /**
   * Mencari tim berdasarkan ID
   */
  async findById(id) {
    return await Team.findByPk(id, {
      include: [
        { model: TeamMember, as: 'leader', attributes: ['id', 'full_name', 'email'] },
        { model: TeamMember, as: 'members' }
      ]
    });
  }

  /**
   * Cek apakah seorang user sudah menjadi leader di tim lain
   */
  async findByLeaderId(leaderId) {
    return await Team.findOne({ where: { leaderId } });
  }

  /**
   * Simpan data tim baru
   */
  async create(teamData) {
    return await Team.create(teamData);
  }

  /**
   * Update data tim (Optimized: direct update)
   */
  async update(id, updateData) {
    const [affectedRows] = await Team.update(updateData, { where: { id } });
    if (affectedRows === 0) return null;
    return this.findById(id);
  }

  /**
   * Soft Delete tim (Optimized: direct destroy)
   */
  async softDelete(id) {
    return await Team.destroy({ where: { id } });
  }
}

module.exports = new TeamRepository();