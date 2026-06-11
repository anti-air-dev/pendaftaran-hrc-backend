'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('team_members', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      team_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE' // Jika tim dihapus, anggotanya otomatis terhapus
      },
      full_name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'full_name'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      identity_card_path: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'identity_card_path'
      },
      role_in_team: {
        type: Sequelize.STRING, // 'leader', 'member'
        allowNull: false,
        defaultValue: 'member',
        field: 'role_in_team'
      },
      verification_status: {
        type: Sequelize.STRING, // 'pending', 'verified', 'rejected'
        allowNull: false,
        defaultValue: 'pending',
        field: 'verification_status'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'updated_at'
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'deleted_at'
      }
    });

    await queryInterface.addIndex('team_members', ['team_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('team_members');
  }
};