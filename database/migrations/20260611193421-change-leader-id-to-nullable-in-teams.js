'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT,
      allowNull: true, // Mengubah menjadi nullable
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  },

  async down(queryInterface, Sequelize) {
    // Kembalikan menjadi NOT NULL jika migration di-rollback
    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT,
      allowNull: false, 
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });
  }
};