const competitionService = require('../services/competition.service');

class CompetitionController {
  /**
   * Mendapatkan semua kompetisi (dengan Pagination & Search)
   * GET /api/competitions
   */
  async getAll(req, res) {
    try {
      const { page, limit, search } = req.query;
      const result = await competitionService.getCompetitions(page, limit, search);

      return res.status(200).json({
        status: 'success',
        message: 'Competitions retrieved successfully',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }

  /**
   * Mendapatkan detail satu kompetisi berdasarkan ID
   * GET /api/competitions/:id
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const competition = await competitionService.getCompetitionById(id);

      return res.status(200).json({
        status: 'success',
        data: { competition }
      });
    } catch (error) {
      return res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Membuat kompetisi baru (Admin Only)
   * POST /api/competitions
   */
  async create(req, res) {
    try {
      const { title, description, start_date, end_date, status } = req.body;

      const newCompetition = await competitionService.createCompetition({
        title,
        description,
        start_date,
        end_date,
        status
      });

      return res.status(201).json({
        status: 'success',
        message: 'Competition created successfully',
        data: { competition: newCompetition }
      });
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Memperbarui data kompetisi (Admin/Committee)
   * PATCH /api/competitions/:id
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const { title, description, start_date, end_date, status } = req.body;

      const updatedCompetition = await competitionService.updateCompetition(id, {
        title,
        description,
        start_date,
        end_date,
        status
      });

      return res.status(200).json({
        status: 'success',
        message: 'Competition updated successfully',
        data: { competition: updatedCompetition }
      });
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Menghapus kompetisi / Soft Delete (Admin Only)
   * DELETE /api/competitions/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await competitionService.deleteCompetition(id);

      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  }

  /**
   * Mengembalikan kompetisi yang di-soft delete (Admin Only)
   * POST /api/competitions/:id/restore
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await competitionService.restoreCompetition(id);

      return res.status(200).json({
        status: 'success',
        message: result.message
      });
    } catch (error) {
      return res.status(400).json({
        status: 'fail',
        message: error.message
      });
    }
  }
}

module.exports = new CompetitionController();