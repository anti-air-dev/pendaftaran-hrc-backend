'use strict';

// 1. Import library bcrypt
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // 2. Generate hash password dengan salt round (biasanya 10)
    const hashedPassword = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('users', [{
      full_name: 'Super Admin',
      username: 'admin',
      email: 'admin@gmail.com',
      // 3. Gunakan variabel hashedPassword di sini
      password: hashedPassword, 
      role: 'admin',
      
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down (queryInterface, Sequelize) {
    // Menghapus data user dengan role admin jika seeder di-undo
    await queryInterface.bulkDelete('users', { role: 'admin' }, {});
  }
};