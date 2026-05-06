'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Competitions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT // Sesuai permintaan: bigint
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      start_date: {
        allowNull: false,
        type: Sequelize.DATEONLY // Menggunakan DATEONLY untuk format YYYY-MM-DD
      },
      end_date: {
        allowNull: false,
        type: Sequelize.DATEONLY
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE // Kolom untuk paranoid (soft delete)
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Competitions');
  }
};