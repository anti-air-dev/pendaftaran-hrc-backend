const CompetitionService = require('../services/competition.service');

class CompetitionController {
  async index(req, res) {
    try {
      const data = await CompetitionService.getAllCompetitions();
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  async store(req, res) {
    try {
      const data = await CompetitionService.createCompetition(req.body);
      res.status(201).json({ status: 'success', data });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async show(req, res) {
    try {
      const data = await CompetitionService.getCompetitionDetail(req.params.id);
      res.status(200).json({ status: 'success', data });
    } catch (error) {
      res.status(404).json({ status: 'error', message: error.message });
    }
  }
}

module.exports = new CompetitionController();