const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth.middleware');

const { createCompetitionValidator } = require('../validators/competition.validator');
const validateResult = require('../middlewares/validationResult.middleware');
const CompetitionController = require('../controllers/competition.controller');

// GET (public)
// router.get('/',authMiddleware, competitionController.getAllCompetitions);

// // POST (auth + validation)
// router.post(
//   '/',
//   authMiddleware,
//   createCompetitionValidator,
//   validateResult,
//   competitionController.createCompetition
// );

router.get('/', CompetitionController.index);
router.post('/', CompetitionController.store);
router.get('/:id', CompetitionController.show);

module.exports = router;