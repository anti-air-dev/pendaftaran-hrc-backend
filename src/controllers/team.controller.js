const teamService = require('../services/team.service');
// Helper untuk mengeliminasi try-catch manual
const asyncHandler = require('../utils/asyncHandler')

class TeamController {
  /**
   * GET /teams
   */
  getAll = asyncHandler(async (req, res) => {
    const { page, limit, search } = req.query;
    const result = await teamService.getTeams(page, limit, search);

    return res.status(200).json({
      status: 'success',
      message: 'Teams retrieved successfully',
      data: result
    });
  });

  /**
   * GET /teams/:id
   */
  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const team = await teamService.getTeamById(id);

    return res.status(200).json({
      status: 'success',
      data: { team }
    });
  });

  /**
   * POST /teams
   */
  create = asyncHandler(async (req, res) => {
    const newTeam = await teamService.createTeam(req.body);

    return res.status(201).json({
      status: 'success',
      message: 'Team created successfully',
      data: { team: newTeam }
    });
  });

  /**
   * PUT /teams/:id
   */
  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedTeam = await teamService.updateTeam(id, req.body);

    return res.status(200).json({
      status: 'success',
      message: 'Team updated successfully',
      data: { team: updatedTeam }
    });
  });

  /**
   * DELETE /teams/:id
   */
  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await teamService.deleteTeam(id);

    return res.status(200).json({
      status: 'success',
      message: result.message
    });
  });
}

module.exports = new TeamController();