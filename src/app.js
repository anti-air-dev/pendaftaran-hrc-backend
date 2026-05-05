const express = require('express');
const app = express();

app.use(express.json());

// routes
const competitionRoutes = require('./routes/competition.routes');
app.use('/competitions', competitionRoutes);

module.exports = app;