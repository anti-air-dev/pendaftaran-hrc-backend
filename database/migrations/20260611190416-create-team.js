'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      leader_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'users', // Nama tabel target di database
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT' // Mencegah user dihapus jika masih memiliki tim aktif
      },
      team_name: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'team_name'
      },
      institution: {
        type: Sequelize.STRING,
        allowNull: false,
        field: 'institution'
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

    // Menambahkan index pada leader_id untuk optimasi query join nantinya
    await queryInterface.addIndex('teams', ['leader_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('teams');
  }
};