const GuidebookRepository = require('../repositories/guidebook.repository');

class GuidebookService {
  async getAllGuidebooks() {
    return await GuidebookRepository.findAll();
  }

  async getGuidebookById(id) {
    const guidebook = await GuidebookRepository.findById(id);
    if (!guidebook) throw new Error('Guidebook not found');
    return guidebook;
  }

  async createGuidebook(data) {
    if (!data.title || !data.competition_id) {
      throw new Error('Title and Competition ID are required');
    }
    return await GuidebookRepository.create(data);
  }

  async updateGuidebook(id, data) {
    const updated = await GuidebookRepository.update(id, data);
    if (!updated) throw new Error('Guidebook not found');
    return updated;
  }

  async deleteGuidebook(id) {
    const deleted = await GuidebookRepository.delete(id);
    if (!deleted) throw new Error('Guidebook not found');
    return deleted;
  }
}

module.exports = new GuidebookService();