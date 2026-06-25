const subCompetitionRepository = require('../repositories/sub-competition.repository');

class SubCompetitionService {
  /**
   * Logika mendapatkan list sub-kompetisi (Pagination & Search)
   */
  async getSubCompetitions(page = 1, limit = 10, search = '', category = '') {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const currentPage = parsedPage > 0 ? parsedPage : 1;
    const currentLimit = parsedLimit > 0 ? parsedLimit : 10;
    const offset = (currentPage - 1) * currentLimit;

    const { count, rows } = await subCompetitionRepository.findWithPagination(
      currentLimit, 
      offset, 
      search, 
      category
    );
    
    const totalPages = Math.ceil(count / currentLimit);

    return {
      totalItems: count,
      subCompetitions: rows,
      totalPages: totalPages,
      currentPage: currentPage,
      limit: currentLimit,
      searchQuery: search,
      categoryFilter: category
    };
  }

  /**
   * Logika mendapatkan satu sub-kompetisi
   */
  async getSubCompetitionById(id) {
    const subCompetition = await subCompetitionRepository.findById(id);
    if (!subCompetition) throw new Error('Sub-competition not found.');
    return subCompetition;
  }

  async getSubCompetitionBySlug(slug) {
    if (!slug) {
      throw new Error('Slug parameter is required');
    }

    const subCompetition = await subCompetitionRepository.findBySlug(slug);
    if (!subCompetition) {
      const error = new Error('Sub-kompetisi tidak ditemukan');
      error.statusCode = 404;
      throw error;
    }

    return subCompetition;
  }

  /**
   * Logika membuat sub-kompetisi baru beserta auto slug
   */
  async createSubCompetition(data) {
    // Generate slug dari field 'name'
    const slug = data.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-');

    // Cek keunikan slug
    const slugExists = await subCompetitionRepository.findBySlug(slug);
    if (slugExists) throw new Error('Sub-competition name already exists, please choose another name.');

    return await subCompetitionRepository.create({
      ...data,
      slug,
      status: data.status || 'maintenance'
    });
  }

  /**
   * Logika memperbarui data sub-kompetisi
   */
  async updateSubCompetition(id, updateData) {
    const subCompetition = await subCompetitionRepository.findById(id);
    if (!subCompetition) throw new Error('Sub-competition not found.');

    // Jika ganti nama, buat ulang slug barunya
    if (updateData.name && updateData.name !== subCompetition.name) {
      const newSlug = updateData.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      const slugExists = await subCompetitionRepository.findBySlug(newSlug);
      if (slugExists) throw new Error('New name causes a slug conflict.');
      updateData.slug = newSlug;
    }

    return await subCompetitionRepository.update(id, updateData);
  }

  /**
   * Logika Soft Delete
   */
  async deleteSubCompetition(id) {
    const subCompetition = await subCompetitionRepository.findById(id);
    if (!subCompetition) throw new Error('Sub-competition not found.');

    await subCompetitionRepository.softDelete(id);
    return { message: 'Sub-competition has been successfully archived.' };
  }

  /**
   * Logika Restore
   */
  async restoreSubCompetition(id) {
    const restored = await subCompetitionRepository.restore(id);
    if (!restored) throw new Error('Failed to restore sub-competition or data not found.');
    return { message: 'Sub-competition has been successfully restored.' };
  }
}

module.exports = new SubCompetitionService();