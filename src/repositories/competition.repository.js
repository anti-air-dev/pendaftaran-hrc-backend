const { Competition, SubCompetition } = require('../models');
const { Op } = require('sequelize');

class CompetitionRepository {
  /**
   * Mengambil list kompetisi dengan Pagination & Search
   */
  async findWithPagination(limit, offset, search = '') {
    const whereClause = {};

    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    return await Competition.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['created_at', 'DESC']], // Sequelize otomatis memetakan ke created_at karena underscored: true
      // Opsional: Sertakan sub-kompetisinya jika ingin langsung tampil di list
      include: [
        {
          model: SubCompetition,
          as: 'subCompetitions'
        }
      ]
    });
  }

  /**
   * Mencari kompetisi berdasarkan ID (Hanya yang belum di-soft delete)
   */
  async findById(id) {
    return await Competition.findByPk(id, {
      include: [{ model: SubCompetition, as: 'subCompetitions' }]
    });
  }

  /**
   * Mencari kompetisi berdasarkan Slug (Sangat berguna untuk URL ramah SEO di frontend)
   */
  async findBySlug(slug) {
    return await Competition.findOne({
      where: { slug },
      include: [{ model: SubCompetition, as: 'subCompetitions' }]
    });
  }

  /**
   * Membuat kompetisi baru
   */
  async create(competitionData) {
    return await Competition.create(competitionData);
  }

  /**
   * Update data kompetisi
   */
  async update(id, updateData) {
    const competition = await Competition.findByPk(id);
    if (!competition) return null;
    return await competition.update(updateData);
  }

  /**
   * 1. SOFT DELETE (Menghapus secara logis menggunakan paranoid)
   */
  async softDelete(id) {
    const competition = await Competition.findByPk(id);
    if (!competition) return null;
    return await competition.destroy(); // Karena paranoid: true, ini otomatis mengisi deleted_at
  }

  /**
   * 2. RESTORE (Mengembalikan data dari soft delete)
   */
  async restore(id) {
    // paranoid: false digunakan agar data yang memiliki deleted_at tetap bisa ditemukan
    const competition = await Competition.findByPk(id, { paranoid: false });
    if (competition && competition.deletedAt) {
      return await competition.restore();
    }
    return null;
  }

  /**
   * 3. HARD DELETE (Menghapus permanen dari database)
   */
  async hardDelete(id) {
    const competition = await Competition.findByPk(id, { paranoid: false });
    if (!competition) return null;
    return await competition.destroy({ force: true }); // force: true bypass paranoid mode
  }
}

module.exports = new CompetitionRepository();