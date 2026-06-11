'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TeamMember extends Model {
    // Di dalam models/teammember.js
    
    static associate(models) {
      this.belongsTo(models.Team, { 
        foreignKey: 'teamId', // Gunakan camelCase
        as: 'team' 
      });

      this.hasOne(models.Team, { 
        foreignKey: 'leaderId', // Gunakan camelCase
        as: 'ledTeam' 
      });
    }
  }
  TeamMember.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    teamId: { type: DataTypes.BIGINT, allowNull: false, field: 'team_id' },
    fullName: { type: DataTypes.STRING, allowNull: false, field: 'full_name' },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false,
      validate: { isEmail: { msg: 'Must be a valid email address.' } }
    },
    identityCardPath: { type: DataTypes.STRING, allowNull: false, field: 'identity_card_path' },
    roleInTeam: { type: DataTypes.STRING, allowNull: false, field: 'role_in_team' },
    verificationStatus: { type: DataTypes.STRING, allowNull: false, field: 'verification_status' }
  }, {
    sequelize,
    modelName: 'TeamMember',
    tableName: 'team_members',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return TeamMember;
};