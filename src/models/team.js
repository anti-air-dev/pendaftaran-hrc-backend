'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // Di dalam models/team.js
    static associate(models) {
      // Relasi ke tabel TeamMembers sebagai ketua
      this.belongsTo(models.TeamMember, {
        foreignKey: 'leaderId', // <-- UBAH DI SINI: Gunakan camelCase sesuai nama atribut di init
        as: 'leader'
      });

      // Relasi ke tabel TeamMembers sebagai anggota bias
      this.hasMany(models.TeamMember, {
        foreignKey: 'teamId', // <-- UBAH JUGA DI SINI (jika sebelumnya team_id)
        as: 'members'
      });

      // Relasi ke tabel Registrations
      this.hasMany(models.Registration, {
        foreignKey: 'teamId', // <-- UBAH JUGA DI SINI
        as: 'registrations'
      });

      Team.belongsTo(models.User, {
        foreignKey: 'user_id', // Kolom di tabel teams yang menyimpan ID user
        as: 'creator'          // Alias (bisa 'user' atau 'creator' agar lebih spesifik sebagai pembuat tim)
      });
    }
  }

  Team.init(
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'user_id' // Mapping dari camelCase ke snake_case database
      },
      leaderId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'leader_id' // Mapping dari camelCase ke snake_case database
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'team_name',
        validate: {
          notEmpty: { msg: 'Team name cannot be empty.' }
        }
      },
      institution: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'institution',
        validate: {
          notEmpty: { msg: 'Institution cannot be empty.' }
        }
      }
    },
    {
      sequelize,
      modelName: 'Team',
      tableName: 'teams',
      underscored: true, // Otomatis mengubah camelCase menjadi snake_case untuk timestamps
      paranoid: true,    // Mengaktifkan fitur Soft Delete (deleted_at)
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      deletedAt: 'deleted_at'
    }
  );

  return Team;
};