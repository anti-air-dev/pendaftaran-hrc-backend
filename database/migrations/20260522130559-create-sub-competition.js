'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sub_competitions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      competition_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'competitions', // Nama tabel target di database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Mencegah kompetisi utama dihapus jika masih ada sub-kompetisinya
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      category: {
        type: Sequelize.ENUM('student', 'college', 'general'),
        allowNull: false
      },
      min_participants: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      max_participants: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      thumbnail_path: {
        type: Sequelize.STRING,
        allowNull: false
      },
      guidebook_path: {
        type: Sequelize.STRING,
        allowNull: true
      },
      registration_fee: {
        type: Sequelize.DECIMAL(12, 2), // Menentukan presisi angka desimal
        allowNull: false,
        defaultValue: 0.00
      },
      registration_start: {
        type: Sequelize.DATE,
        allowNull: false
      },
      registration_end: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('open', 'closed', 'maintenance'),
        allowNull: false,
        defaultValue: 'maintenance'
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
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sub_competitions');
  }
};