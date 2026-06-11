'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('registrations', {
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
        onDelete: 'RESTRICT'
      },
      sub_competition_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'sub_competitions', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      registration_status: {
        type: Sequelize.STRING, // 'awaiting_payment', 'pending_verification', 'registered', 'rejected'
        allowNull: false,
        defaultValue: 'awaiting_payment',
        field: 'registration_status'
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

    await queryInterface.addIndex('registrations', ['team_id']);
    await queryInterface.addIndex('registrations', ['sub_competition_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('registrations');
  }
};