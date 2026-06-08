const GuidebookService = require('../services/guidebook.service');

class GuidebookController {
  async index(req, res) {
    try {
      const data = await GuidebookService.getAllGuidebooks();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async show(req, res) {
    try {
      const data = await GuidebookService.getGuidebookById(req.params.id);
      res.status(200).json(data);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  async store(req, res) {
    try {
      const data = await GuidebookService.createGuidebook(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async update(req, res) {
    try {
      const data = await GuidebookService.updateGuidebook(req.params.id, req.body);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async destroy(req, res) {
    try {
      await GuidebookService.deleteGuidebook(req.params.id);
      res.status(200).json({ message: 'Guidebook deleted successfully' });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }
}

module.exports = new GuidebookController();