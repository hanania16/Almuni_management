import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  receiptNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  paymentDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  paymentStatus: {
    type: DataTypes.ENUM('Pending', 'Paid', 'Rejected', 'Refunded'),
    defaultValue: 'Pending',
  },
  documentRequestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'document_request',
      key: 'id',
    },
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'payment',
  indexes: [
    {
      unique: true,
      fields: ['receipt_number'],
    },
    {
      fields: ['document_request_id'],
    },
  ],
});

export default Payment;

