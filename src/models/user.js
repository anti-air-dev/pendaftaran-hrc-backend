'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Definisi relasi di sini nanti
    }
  };
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: 'participant'
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true, // created_at, updated_at
    timestamps: true,
    paranoid: true, // deleted_at

    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  return User;
};