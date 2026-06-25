'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Hapus constraint lama yang salah (mengarah ke users)
    await queryInterface.removeConstraint('teams', 'teams_ibfk_1');

    // 2. Pastikan kolom leader_id mengizinkan NULL (WAJIB untuk menghindari circular error)
    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT, // Sesuaikan tipe data dengan yang ada di model Anda
      allowNull: true,
    });

    // 3. Tambahkan constraint baru yang benar (mengarah ke team_members)
    await queryInterface.addConstraint('teams', {
      fields: ['leader_id'],
      type: 'foreign key',
      name: 'teams_leader_fk', // Nama constraint baru
      references: {
        table: 'team_members', // Nama tabel referensi di database (biasanya jamak)
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // FUNGSI ROLLBACK (Jika migrasi di-undo)
    
    // 1. Hapus constraint yang baru
    await queryInterface.removeConstraint('teams', 'teams_leader_fk');

    // 2. Kembalikan constraint lama (mengarah ke users)
    await queryInterface.addConstraint('teams', {
      fields: ['leader_id'],
      type: 'foreign key',
      name: 'teams_ibfk_1',
      references: {
        table: 'users',
        field: 'id'
      },
      onDelete: 'RESTRICT', // Mengikuti error Anda sebelumnya
      onUpdate: 'CASCADE'
    });
  }
};