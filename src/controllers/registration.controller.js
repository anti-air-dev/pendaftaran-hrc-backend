const registrationService = require('../services/registration.service');
const asyncHandler = require('../utils/asyncHandler');

class RegistrationController {
  
  /**
   * Handle pendaftaran tim baru sekaligus daftar lomba
   */
  register = asyncHandler(async (req, res) => {
    // Panggil service All-in-One
    const result = await registrationService.registerNewTeamAndMembers(req.body, req.files);

    return res.status(201).json({
      status: 'success',
      message: 'Team successfully registered. Please proceed to payment.',
      data: {
        registrationId: result.id,
        teamId: result.teamId,
        status: result.registrationStatus
      }
    });
  });

  /**
   * Mendapatkan daftar pendaftaran
   */
  getAll = asyncHandler(async (req, res) => {
    const filters = req.query; // Bisa filter by status dll
    const registrations = await registrationService.getAllRegistrations(filters);
    
    return res.status(200).json({
      status: 'success',
      data: registrations
    });
  });

  /**
   * Mendapatkan detail satu pendaftaran
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const registration = await registrationService.getRegistrationById(id);
    
    return res.status(200).json({
      status: 'success',
      data: registration
    });
  });
}

module.exports = new RegistrationController();