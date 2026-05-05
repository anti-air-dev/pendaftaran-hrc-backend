const express = require('express');
const router = express.Router();

const competitionController = require('../controllers/competition.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const { createCompetitionValidator } = require('../validators/competition.validator');
const validateResult = require('../middlewares/validationResult.middleware');

// GET (public)
router.get('/',authMiddleware, competitionController.getAllCompetitions);

// POST (auth + validation)
router.post(
  '/',
  authMiddleware,
  createCompetitionValidator,
  validateResult,
  competitionController.createCompetition
);

module.exports = router;