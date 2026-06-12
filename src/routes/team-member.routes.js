const express = require('express');
const router = express.Router();

const teamMemberController = require('../controllers/team-member.controller');
const { validateCreateTeamMember, validateUpdateTeamMember } = require('../validators/team-member.validator');

// Endpoint: GET /team-members & POST /team-members
router.route('/')
  .get(teamMemberController.getAll)
  .post(validateCreateTeamMember, teamMemberController.create);

// Endpoint: GET, PUT, dan DELETE /team-members/{id}
router.route('/:id')
  .get(teamMemberController.getById)
  .put(validateUpdateTeamMember, teamMemberController.update)
  .delete(teamMemberController.delete);

module.exports = router;