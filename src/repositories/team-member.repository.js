const { TeamMember, Team } = require('../models');

class TeamMemberRepository {
  /**
   * Mengambil semua anggota (dengan pagination & filter)
   */
  async findAndCountAll(options = {}) {
    const { limit, offset, where } = options;
    return await TeamMember.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: Team, as: 'team', attributes: ['id', 'teamName', 'institution'] }
      ],
      distinct: true,
      order: [['created_at', 'ASC']]
    });
  }

  /**
   * Mengambil detail satu anggota berdasarkan ID
   */
  async findById(id) {
    return await TeamMember.findByPk(id, {
      include: [
        { model: Team, as: 'team', attributes: ['id', 'teamName', 'institution'] }
      ]
    });
  }

  /**
   * Menambahkan anggota baru ke dalam tim
   */
  async create(memberData) {
    return await TeamMember.create(memberData);
  }

  /**
   * Memperbarui data anggota (Optimized)
   */
  async update(id, updateData) {
    const [affectedRows] = await TeamMember.update(updateData, { where: { id } });
    if (affectedRows === 0) return null;
    return this.findById(id);
  }

  /**
   * Soft Delete anggota tim
   */
  async softDelete(id) {
    return await TeamMember.destroy({ where: { id } });
  }
}

module.exports = new TeamMemberRepository();