'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Menambahkan kolom user_id ke tabel teams
    await queryInterface.addColumn('teams', 'user_id', {
      type: Sequelize.BIGINT, // ⚠️ Pastikan tipe data ini SAMA dengan tipe data 'id' di tabel users (biasanya BIGINT atau INTEGER)
      
      // 💡 PENTING: 
      // Jika tabel 'teams' Anda sudah berisi data, set allowNull ke `true` agar migrasi tidak error.
      // Jika tabel masih kosong, Anda bisa set ke `false` agar lebih ketat.
      allowNull: true, 
      
      references: {
        model: 'users', // Nama tabel referensi di database (biasanya jamak: 'users')
        key: 'id'       // Kolom yang direferensikan
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Jika user dihapus, maka tim yang dibuatnya juga akan ikut terhapus
    });
  },

  async down(queryInterface, Sequelize) {
    // Fungsi rollback: Menghapus kolom user_id beserta constraint-nya jika migrasi di-undo
    await queryInterface.removeColumn('teams', 'user_id');
  }
};