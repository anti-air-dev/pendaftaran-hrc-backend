'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Registration extends Model {
    static associate(models) {
      this.belongsTo(models.Team, { foreignKey: 'team_id', as: 'team' });
      this.belongsTo(models.SubCompetition, { foreignKey: 'sub_competition_id', as: 'subCompetition' });
      this.hasOne(models.Payment, { foreignKey: 'registration_id', as: 'payment' });
    }
  }
  Registration.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    teamId: { type: DataTypes.BIGINT, allowNull: false, field: 'team_id' },
    subCompetitionId: { type: DataTypes.BIGINT, allowNull: false, field: 'sub_competition_id' },
    registrationStatus: { type: DataTypes.STRING, allowNull: false, field: 'registration_status' }
  }, {
    sequelize,
    modelName: 'Registration',
    tableName: 'registrations',
    underscored: true,
    paranoid: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return Registration;
};