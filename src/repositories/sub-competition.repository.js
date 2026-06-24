const { SubCompetition, Competition } = require('../models');
const { Op } = require('sequelize');

class SubCompetitionRepository {
  /**
   * Mengambil list sub-kompetisi dengan Pagination, Search, dan opsional filter Kategori
   */
  async findWithPagination(limit, offset, search = '', category = '') {
    const whereClause = {};

    // Kriteria Pencarian berdasarkan Nama
    if (search) {
      whereClause.name = { [Op.like]: `%${search}%` };
    }

    // Ekstra Kriteria: Filter berdasarkan Kategori (student/college/general) jika dikirim
    if (category) {
      whereClause.category = category;
    }

    return await SubCompetition.findAndCountAll({
      where: whereClause,
      limit: limit,
      offset: offset,
      order: [['created_at', 'DESC']],
      // Otomatis join dengan table Competition utama
      include: [
        {
          model: Competition,
          as: 'competition',
          attributes: ['id', 'title', 'slug'] // Ambil kolom yang penting saja
        }
      ]
    });
  }

  /**
   * Mencari sub-kompetisi berdasarkan ID
   */
  async findById(id) {
    return await SubCompetition.findByPk(id, {
      include: [{ model: Competition, as: 'competition' }]
    });
  }

  /**
   * Mencari sub-kompetisi berdasarkan Slug
   */
  async findBySlug(slug) {
    return await SubCompetition.findOne({
      where: { slug },
      include: [{ model: Competition, as: 'competition' }]
    });
  }

  /**
   * Simpan data sub-kompetisi baru
   */
  async create(subCompetitionData) {
    return await SubCompetition.create(subCompetitionData);
  }

  /**
   * Update data sub-kompetisi
   */
  async update(id, updateData) {
    const subCompetition = await SubCompetition.findByPk(id);
    if (!subCompetition) return null;
    return await subCompetition.update(updateData);
  }

  /**
   * 1. SOFT DELETE (Paranoid)
   */
  async softDelete(id) {
    const subCompetition = await SubCompetition.findByPk(id);
    if (!subCompetition) return null;
    return await subCompetition.destroy();
  }

  /**
   * 2. RESTORE
   */
  async restore(id) {
    const subCompetition = await SubCompetition.findByPk(id, { paranoid: false });
    if (subCompetition && subCompetition.deletedAt) {
      return await subCompetition.restore();
    }
    return null;
  }

  /**
   * 3. HARD DELETE (Permanen)
   */
  async hardDelete(id) {
    const subCompetition = await SubCompetition.findByPk(id, { paranoid: false });
    if (!subCompetition) return null;
    return await subCompetition.destroy({ force: true });
  }
}

module.exports = new SubCompetitionRepository();