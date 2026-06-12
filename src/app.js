require('dotenv').config(); // Panggil ini paling atas!
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const YAML = require('yamljs');
const path = require('path');
const app = express();


// Sekarang kamu bisa mengaksesnya lewat process.env
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET;

app.use(express.json());

// 1. Load base swagger definition
const swaggerBase = YAML.load(path.join(__dirname, '..','docs', 'swagger.yaml'));

// 2. Konfigurasi swagger-jsdoc
const swaggerOptions = {
  definition: swaggerBase,
  // Tunjuk ke lokasi semua file documentation kamu
  apis: [
    path.join(__dirname, '../docs/paths/*.yaml'), // Semua file yaml di folder paths
    // Kamu juga bisa menambahkan dokumentasi langsung di dalam file routes jika mau:
    // path.join(__dirname, 'routes/*.js') 
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Tambahkan ini jika nanti kamu menggunakan Cookies/Sessions
}));
// 3. Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Routes API ---
const userRoutes = require('./routes/user.routes');
const competitionRoutes = require('./routes/competition.routes');
const subCompetitionRoutes = require("./routes/sub-competition.routes");
const teamRoutes = require("./routes/team.routes");
const registrationRoutes = require("./routes/registration.routes");
const paymentRoutes = require("./routes/payment.routes");
const teamMemberRoutes = require("./routes/team-member.routes");

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

app.use('/api/users', userRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/sub-competitions', subCompetitionRoutes);
app.use('/api/teams/', teamRoutes);
app.use('/api/registrations/', registrationRoutes);
app.use('/api/payments/', paymentRoutes);
app.use('/api/team-members/', teamMemberRoutes);

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// ... rest of your code
module.exports = app;