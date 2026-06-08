const { Guidebook } = require('../models');

class GuidebookRepository {
  async findAll() {
    return await Guidebook.findAll();
  }

  async findById(id) {
    return await Guidebook.findByPk(id);
  }

  async create(data) {
    return await Guidebook.create(data);
  }

  async update(id, data) {
    const guidebook = await Guidebook.findByPk(id);
    if (guidebook) {
      return await guidebook.update(data);
    }
    return null;
  }

  async delete(id) {
    const guidebook = await Guidebook.findByPk(id);
    if (guidebook) {
      return await guidebook.destroy();
    }
    return null;
  }
}

module.exports = new GuidebookRepository();