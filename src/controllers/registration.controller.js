const registrationService = require('../services/registration.service');

class RegistrationController {
  async register(req, res) {
    try {
      let payload = req.body;
      if (typeof req.body.payload === 'string') {
        payload = JSON.parse(req.body.payload);
      }

      const result = await registrationService.registerNewTeamAndMembers(payload, req.files);
      return res.status(201).json({
        success: true,
        message: 'Registration created successfully.',
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const data = await registrationService.getAllRegistrations(req.query);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const data = await registrationService.getRegistrationById(req.params.id);
      return res.status(200).json({ success: true, data });
    } catch (error) {
      return res.status(404).json({ success: false, message: error.message });
    }
  }

  async update(req, res) {
    try {
      const { status, registrationStatus } = req.body;
      // Mendukung fleksibilitas penamaan properti status dari request body
      const targetStatus = registrationStatus || status; 

      const data = await registrationService.updateStatus(req.params.id, targetStatus);
      return res.status(200).json({
        success: true,
        message: 'Registration updated successfully.',
        data
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({ success: false, message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await registrationService.deleteRegistration(req.params.id);
      return res.status(200).json({
        success: true,
        message: 'Registration deleted successfully.'
      });
    } catch (error) {
      const statusCode = error.message.includes('not found') ? 404 : 400;
      return res.status(statusCode).json({ success: false, message: error.message });
    }
  }
}

module.exports = new RegistrationController();