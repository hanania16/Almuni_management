import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const AttachedDocument = sequelize.define('AttachedDocument', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  fileName: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  originalName: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  fileType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  filePath: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  documentType: {
    type: DataTypes.ENUM('Cost Sharing Letter', 'Other Documents', 'ID Copy', 'Receipt'),
    allowNull: true,
  },
  documentRequestId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'document_request',
      key: 'id',
    },
  },
}, {
  tableName: 'attached_document',
  indexes: [
    {
      fields: ['document_request_id'],
    },
  ],
});

export default AttachedDocument;

