'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan kolom phone_number
    await queryInterface.addColumn('team_members', 'phone_number', {
      type: Sequelize.STRING,
      allowNull: true, // Di-set true dulu agar jika ada data dummy lama tidak error/crash
    });

    // Menambahkan kolom identity_number
    await queryInterface.addColumn('team_members', 'identity_number', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Menghapus kolom jika di-rollback
    await queryInterface.removeColumn('team_members', 'phone_number');
    await queryInterface.removeColumn('team_members', 'identity_number');
  }
};