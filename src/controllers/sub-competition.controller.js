const subCompetitionService = require('../services/sub-competition.service');

class SubCompetitionController {
  /**
   * Mendapatkan semua sub-kompetisi (dengan Pagination, Search, Filter Category)
   */
  async getAll(req, res) {
    try {
      const { page, limit, search, category } = req.query;
      const result = await subCompetitionService.getSubCompetitions(page, limit, search, category);

      return res.status(200).json({
        status: 'success',
        message: 'Sub-competitions retrieved successfully',
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
   * Mendapatkan detail satu sub-kompetisi
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const subCompetition = await subCompetitionService.getSubCompetitionById(id);

      return res.status(200).json({
        status: 'success',
        data: { subCompetition }
      });
    } catch (error) {
      return res.status(404).json({
        status: 'fail',
        message: error.message
      });
    }
  }

/**
   * Membuat sub-kompetisi baru
   */
  async create(req, res) {
    try {
      const data = req.body; 
      console.log('Data body yang diterima di controller:', req.files);

      // Jika ada file yang diupload, simpan path-nya ke data
      if (req.files) {
        if (req.files['thumbnail']) {
          // Simpan relative path agar mudah diakses dari frontend
          data.thumbnail_path = `/uploads/thumbnails/${req.files['thumbnail'][0].filename}`;
        }
        if (req.files['guidebook']) {
          data.guidebook_path = `/uploads/guidebooks/${req.files['guidebook'][0].filename}`;
        }
      }

      const newSubCompetition = await subCompetitionService.createSubCompetition(data);

      return res.status(201).json({
        status: 'success',
        message: 'Sub-competition created successfully',
        data: { subCompetition: newSubCompetition }
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  /**
   * Memperbarui sub-kompetisi
   */
  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.files) {
        if (req.files['thumbnail']) {
          updateData.thumbnail_path = `/uploads/thumbnails/${req.files['thumbnail'][0].filename}`;
        }
        if (req.files['guidebook']) {
          updateData.guidebook_path = `/uploads/guidebooks/${req.files['guidebook'][0].filename}`;
        }
      }

      const updatedSubCompetition = await subCompetitionService.updateSubCompetition(id, updateData);

      return res.status(200).json({
        status: 'success',
        message: 'Sub-competition updated successfully',
        data: { subCompetition: updatedSubCompetition }
      });
    } catch (error) {
      return res.status(400).json({ status: 'fail', message: error.message });
    }
  }

  /**
   * Soft Delete sub-kompetisi (Admin)
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await subCompetitionService.deleteSubCompetition(id);

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
   * Restore sub-kompetisi (Admin)
   */
  async restore(req, res) {
    try {
      const { id } = req.params;
      const result = await subCompetitionService.restoreSubCompetition(id);

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

module.exports = new SubCompetitionController();