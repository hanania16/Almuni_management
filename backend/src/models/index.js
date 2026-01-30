import { sequelize } from '../config/database.js';
import Person from './Person.js';
import DocumentRequest from './DocumentRequest.js';
import AttachedDocument from './AttachedDocument.js';
import Payment from './Payment.js';
import User from './User.js';

// Set up associations

// Person -> DocumentRequest (1:M)
Person.hasMany(DocumentRequest, {
  foreignKey: 'personId',
  as: 'documentRequests',
});

DocumentRequest.belongsTo(Person, {
  foreignKey: 'personId',
  as: 'person',
});

// DocumentRequest -> AttachedDocument (1:M)
DocumentRequest.hasMany(AttachedDocument, {
  foreignKey: 'documentRequestId',
  as: 'attachedDocuments',
});

AttachedDocument.belongsTo(DocumentRequest, {
  foreignKey: 'documentRequestId',
  as: 'documentRequest',
});

// DocumentRequest -> Payment (1:1)
DocumentRequest.hasOne(Payment, {
  foreignKey: 'documentRequestId',
  as: 'payment',
});

Payment.belongsTo(DocumentRequest, {
  foreignKey: 'documentRequestId',
  as: 'documentRequest',
});

// User -> Person (1:1, via email)
User.belongsTo(Person, {
  foreignKey: 'email',
  targetKey: 'email',
  as: 'person',
});

Person.hasOne(User, {
  foreignKey: 'email',
  sourceKey: 'email',
  as: 'user',
});

export {
  sequelize,
  Person,
  DocumentRequest,
  AttachedDocument,
  Payment,
  User,
};

export default {
  sequelize,
  Person,
  DocumentRequest,
  AttachedDocument,
  Payment,
  User,
};

