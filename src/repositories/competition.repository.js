const { Competition } = require('../models');

class CompetitionRepository {
  async findAll() {
    return await Competition.findAll();
  }

  async findById(id) {
    return await Competition.findByPk(id);
  }

  async create(data) {
    return await Competition.create(data);
  }

  async update(id, data) {
    const competition = await Competition.findByPk(id);
    if (competition) {
      return await competition.update(data);
    }
    return null;
  }

  async delete(id) {    
    const competition = await Competition.findByPk(id);
    if (competition) {
      return await competition.destroy(); // Ini akan melakukan Soft Delete (paranoid)
    }
    return null;
  }
}

module.exports = new CompetitionRepository();