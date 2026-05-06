'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Competition extends Model {
    static associate(models) {
      // Definisikan relasi di sini jika ada
    }
  }
  Competition.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Competition',
    tableName: 'Competitions', // Nama tabel di database
    underscored: true,        // Menggunakan snake_case (created_at) di DB
    paranoid: true,           // Aktifkan Soft Delete (deleted_at)
    timestamps: true          // Mengelola created_at & updated_at secara otomatis
  });
  
  return Competition;
};