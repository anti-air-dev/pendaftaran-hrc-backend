'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Payment extends Model {
    static associate(models) {
      this.belongsTo(models.Registration, { foreignKey: 'registration_id', as: 'registration' });
    }
  }
  Payment.init({
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    registrationId: { type: DataTypes.BIGINT, allowNull: false, field: 'registration_id' },
    transactionId: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'transaction_id' },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    paymentMethod: { type: DataTypes.STRING, allowNull: false, field: 'payment_method' },
    paymentStatus: { type: DataTypes.STRING, allowNull: false, field: 'payment_status' },
    paidAt: { type: DataTypes.DATE, allowNull: true, field: 'paid_at' }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false, // Dimatikan karena tidak ada di ERD
    deletedAt: false  // Dimatikan karena tidak ada di ERD
  });
  return Payment;
};