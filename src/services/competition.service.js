const CompetitionRepository = require('../repositories/competition.repository');

class CompetitionService {
  async getAllCompetitions() {
    return await CompetitionRepository.findAll();
  }

  async createCompetition(payload) {
    // Contoh Logika Bisnis: Validasi tanggal
    if (new Date(payload.start_date) > new Date(payload.end_date)) {
      throw new Error("Tanggal mulai tidak boleh lebih besar dari tanggal selesai.");
    }
    return await CompetitionRepository.create(payload);
  }

  async getCompetitionDetail(id) {
    const data = await CompetitionRepository.findById(id);
    if (!data) throw new Error("Kompetisi tidak ditemukan.");
    return data;
  }
}

module.exports = new CompetitionService();