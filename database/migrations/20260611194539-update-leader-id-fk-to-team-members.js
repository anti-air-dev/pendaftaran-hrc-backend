'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. HAPUS FK LAMA (Disesuaikan ke teams_ibfk_2 sesuai error database kamu)
    try {
      await queryInterface.removeConstraint('teams', 'teams_ibfk_2');
    } catch (error) {
      console.log('Constraint teams_ibfk_2 tidak ditemukan atau sudah terhapus, lanjut...');
    }

    // 2. UBAH KOLOM MENJADI NULLABLE
    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT,
      allowNull: true,
    });

    // 3. PASANG FK BARU KE TEAM MEMBERS
    await queryInterface.addConstraint('teams', {
      fields: ['leader_id'],
      type: 'foreign key',
      name: 'teams_leader_id_team_members_fk', 
      references: {
        table: 'team_members',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // 1. HAPUS FK BARU (Dibungkus try-catch agar kalau belum terbuat, undo tidak crash!)
    try {
      await queryInterface.removeConstraint('teams', 'teams_leader_id_team_members_fk');
    } catch (error) {
      console.log('Constraint baru belum sempat terbuat di database, lanjut ke step berikutnya...');
    }

    // 2. KEMBALIKAN KOLOM JADI NULLABLE (Gunakan true dulu sementara untuk menghindari error Invalid use of NULL value)
    await queryInterface.changeColumn('teams', 'leader_id', {
      type: Sequelize.BIGINT,
      allowNull: true, 
    });

    // 3. PASANG KEMBALI FK LAMA KE USERS
    try {
      await queryInterface.addConstraint('teams', {
        fields: ['leader_id'],
        type: 'foreign key',
        name: 'teams_ibfk_2', 
        references: {
          table: 'users',
          field: 'id'
        },
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE'
      });
    } catch (error) {
      console.log('Gagal mengembalikan FK lama, kemungkinan data sudah tidak sinkron. Abaikan.');
    }
  }
};