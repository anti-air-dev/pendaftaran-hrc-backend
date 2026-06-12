const teamMemberService = require('../services/team-member.service');
const asyncHandler = require('../utils/asyncHandler');

class TeamMemberController {
  
  getAll = asyncHandler(async (req, res) => {
    const result = await teamMemberService.getAllTeamMembers(req.query);
    return res.status(200).json({
      status: 'success',
      message: 'Team members retrieved successfully',
      data: result
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const member = await teamMemberService.getMemberById(id);
    return res.status(200).json({
      status: 'success',
      data: member
    });
  });

  create = asyncHandler(async (req, res) => {
    const newMember = await teamMemberService.addMember(req.body);
    return res.status(201).json({
      status: 'success',
      message: 'Team member added successfully',
      data: newMember
    });
  });

  update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedMember = await teamMemberService.updateMember(id, req.body);
    return res.status(200).json({
      status: 'success',
      message: 'Team member updated successfully',
      data: updatedMember
    });
  });

  delete = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const response = await teamMemberService.removeMember(id);
    return res.status(200).json({
      status: 'success',
      message: response.message
    });
  });
}

module.exports = new TeamMemberController();