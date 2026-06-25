const registrationService = require('../services/registration.service');
const { matchedData } = require('express-validator'); 


class RegistrationController {
  async register(req, res) {
    try {
      // 🚨 MENGAMBIL DATA YANG BERSIH & TERVALIDASI SAJA
      // includeOptionals: true memastikan field optional (seperti members) tetap ikut jika ada
      const validatedPayload = matchedData(req, { includeOptionals: true });
      
      validatedPayload.userId = req.user.id; 

      // Kirim validatedPayload ke service, JANGAN req.body
      const result = await registrationService.registerNewTeamAndMembers(validatedPayload, req.files);
      
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

  async getMyRegistrations(req, res) {
    try {
      // req.user.id didapatkan dari middleware token autentikasi Anda
      const userId = req.user.id; 
      const registrations = await registrationService.getUserRegistrations(userId);

      return res.status(200).json({
        status: 'success',
        message: 'Data registrasi user berhasil dimuat',
        data: registrations
      });
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: error.message || 'Gagal memuat data registrasi'
      });
    }
  }

  async getMyRegistrationDetail(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id; // Dari middleware otentikasi

      const data = await registrationService.getMyRegistrationById(id, userId);

      return res.status(200).json({
        status: 'success',
        message: 'Detail registrasi berhasil dimuat',
        data: data
      });
    } catch (error) {
       return res.status(404).json({
        status: 'error',
        message: error.message
      });
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