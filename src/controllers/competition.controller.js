const Competition = require('../models/competition.model');
// let competitions = require('../data/competition.data');

let competitions = [
  new Competition(1, 'Lomba Coding', 'Dicoding', '2026-05-01', 'Online'),
  new Competition(2, 'Hackathon Nasional', 'Kominfo', '2026-06-15', 'Jakarta')
];

// GET /competitions
exports.getAllCompetitions = (req, res) => {
  res.json({
    message: 'Success',
    data: competitions
  });
};

// POST /competitions
exports.createCompetition = (req, res) => {
  const { name, organizer, date, location } = req.body;

  if (!name || !organizer || !date || !location) {
    return res.status(400).json({
      message: 'All fields are required'
    });
  }

  const newCompetition = new Competition(
    competitions.length + 1,
    name,
    organizer,
    date,
    location
  );

  competitions.push(newCompetition);

  res.status(201).json({
    message: 'Competition created',
    data: newCompetition
  });
};