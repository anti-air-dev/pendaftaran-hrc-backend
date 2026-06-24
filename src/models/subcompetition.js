'use strict';
const { Model } = require('sequelize');
const competition = require('./competition');

module.exports = (sequelize, DataTypes) => {
  class SubCompetition extends Model {
    static associate(models) {
      // Relasi Many-to-One: Sub-kompetisi dimiliki oleh satu kompetisi utama
      SubCompetition.belongsTo(models.Competition, {
        foreignKey: 'competition_id',
        as: 'competition'
      });
      
      // Catatan: Di masa mendatang Anda akan menambahkan relasi ke model Registrations di sini:
      // SubCompetition.hasMany(models.Registration, { foreignKey: 'sub_competition_id', as: 'registrations' });
    }
  }
  SubCompetition.init({
    competition_id: {
      type: DataTypes.BIGINT,
      field: 'competition_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    category: DataTypes.ENUM('student', 'college', 'general'),
    min_participants: {
      type: DataTypes.INTEGER,
      field: 'min_participants'
    },
    max_participants: {
      type: DataTypes.INTEGER,
      field: 'max_participants'
    },
    thumbnail_path: {
      type: DataTypes.STRING,
      field: 'thumbnail_path'
    },
    guidebook_path: {
      type: DataTypes.STRING,
      field: 'guidebook_path',
      allowNull: true,
    },
    registration_fee: {
      type: DataTypes.DECIMAL(12, 2),
      field: 'registration_fee'
    },
    registration_start: {
      type: DataTypes.DATE,
      field: 'registration_start'
    },
    registration_end: {
      type: DataTypes.DATE,
      field: 'registration_end'
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'maintenance'),
      defaultValue: 'maintenance'
    }
  }, {
    sequelize,
    modelName: 'SubCompetition',
    tableName: 'sub_competitions',
    underscored: true,
    paranoid: true,
    deletedAt: 'deleted_at',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return SubCompetition;
};