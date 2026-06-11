'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. HAPUS FK LAMA
    // GANTI 'teams_ibfk_1' dengan nama constraint asli yang kamu temukan di database
    try {
      await queryInterface.removeConstraint('teams', 'teams_ibfk_1');
    } catch (error) {
      console.log('Constraint lama tidak ditemukan atau sudah terhapus, lanjut ke step 2...');
    }

    // 2. UBAH KOLOM MENJADI NULLABLE (Murni tanpa referensi FK)
    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    // 3. PASANG FK BARU KE TEAM MEMBERS
    await queryInterface.addConstraint('teams', {
      fields: ['leader_id'],
      type: 'foreign key',
      name: 'teams_leader_id_team_members_fk', // Kita beri nama kustom agar rapi
      references: {
        table: 'team_members',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Lakukan kebalikannya jika di-rollback
    await queryInterface.removeConstraint('teams', 'teams_leader_id_team_members_fk');

    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT,
      allowNull: false, // Kembalikan ke asal
    });

    await queryInterface.addConstraint('teams', {
      fields: ['leader_id'],
      type: 'foreign key',
      name: 'teams_ibfk_1', // Kembalikan ke nama awal
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE'
    });
  }
};