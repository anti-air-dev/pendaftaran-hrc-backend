const competitionRepository = require('../repositories/competition.repository');

class CompetitionService {
  /**
   * Logika mengambil semua kompetisi dengan pagination & pencarian
   */
  async getCompetitions(page = 1, limit = 10, search = '') {
    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);

    const currentPage = parsedPage > 0 ? parsedPage : 1;
    const currentLimit = parsedLimit > 0 ? parsedLimit : 10;
    const offset = (currentPage - 1) * currentLimit;

    const { count, rows } = await competitionRepository.findWithPagination(currentLimit, offset, search);
    const totalPages = Math.ceil(count / currentLimit);

    return {
      totalItems: count,
      competitions: rows,
      totalPages: totalPages,
      currentPage: currentPage,
      limit: currentLimit,
      searchQuery: search
    };
  }

  /**
   * Logika mengambil satu detail kompetisi
   */
  async getCompetitionById(id) {
    const competition = await competitionRepository.findById(id);
    if (!competition) throw new Error('Competition not found.');
    return competition;
  }

  /**
   * Logika membuat kompetisi baru beserta pembuatan slug otomatis
   */
  async createCompetition(competitionData) {
    // Membuat slug sederhana dari title (Contoh: "HRC Web Design 2026" menjadi "hrc-web-design-2026")
    const slug = competitionData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter spesial
      .replace(/\s+/g, '-');        // Ganti spasi dengan minus

    // Cek duplikasi slug
    const slugExists = await competitionRepository.findBySlug(slug);
    if (slugExists) throw new Error('A competition with a similar title already exists.');

    return await competitionRepository.create({
      ...competitionData,
      slug,
      status: competitionData.status || 'draft'
    });
  }

  /**
   * Logika update kompetisi
   */
  async updateCompetition(id, updateData) {
    const competition = await competitionRepository.findById(id);
    if (!competition) throw new Error('Competition not found.');

    // Jika judul diubah, regenerasi slug-nya
    if (updateData.title && updateData.title !== competition.title) {
      const newSlug = updateData.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
      const slugExists = await competitionRepository.findBySlug(newSlug);
      if (slugExists) throw new Error('New title causes a slug conflict.');
      updateData.slug = newSlug;
    }

    return await competitionRepository.update(id, updateData);
  }

  /**
   * Logika Soft Delete Kompetisi
   */
  async deleteCompetition(id) {
    const competition = await competitionRepository.findById(id);
    if (!competition) throw new Error('Competition not found.');

    await competitionRepository.softDelete(id);
    return { message: 'Competition has been successfully archived (soft deleted).' };
  }

  /**
   * Logika Restore Kompetisi
   */
  async restoreCompetition(id) {
    const restored = await competitionRepository.restore(id);
    if (!restored) throw new Error('Failed to restore competition or competition not found.');
    return { message: 'Competition has been successfully restored.' };
  }
}

module.exports = new CompetitionService();