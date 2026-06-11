'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      registration_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'registrations', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      transaction_id: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        field: 'transaction_id'
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'payment_method'
      },
      payment_status: {
        type: Sequelize.STRING, // 'pending', 'completed', 'failed', 'expired'
        allowNull: false,
        defaultValue: 'pending',
        field: 'payment_status'
      },
      paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'paid_at'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'created_at'
      }
    });

    await queryInterface.addIndex('payments', ['registration_id']);
    await queryInterface.addIndex('payments', ['transaction_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('payments');
  }
};