'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Competition extends Model {
    static associate(models) {
      // Relasi One-to-Many: Satu kompetisi memiliki banyak sub-kompetisi
      Competition.hasMany(models.SubCompetition, {
        foreignKey: 'competition_id',
        as: 'subCompetitions'
      });
    }
  }

  Competition.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false // <-- Ini penyebabnya! Kolom ini wajib diisi di level DB/Migrasi.
    },
    start_date: {
      type: DataTypes.DATEONLY,
      field: 'start_date' // Pemetaan dari DB snake_case ke JS camelCase
    },
    end_date: {
      type: DataTypes.DATEONLY,
      field: 'end_date'
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'archived'),
      defaultValue: 'draft'
    }
  }, {
    sequelize,
    modelName: 'Competition',
    tableName: 'competitions',
    underscored: true, // Otomatis menggunakan snake_case untuk created_at, updated_at
    paranoid: true,    // Mengaktifkan fitur Soft Deletes (deleted_at)
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return Competition;
};