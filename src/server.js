// server.js
require('dotenv').config(); // Memuat variabel dari file .env
const app = require('./app');
const db = require('./models');

const PORT = process.env.PORT || 3000;

/**
 * Fungsi untuk menyalakan server setelah memastikan 
 * koneksi database berhasil.
 */
const startServer = async () => {
  try {
    // 1. Verifikasi koneksi database
    await db.sequelize.authenticate();
    console.log('✅ Database connected successfully.');

    // 2. Jalankan server Express
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1); // Hentikan proses jika database gagal terhubung
  }
};

startServer();