import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Person from './Person.js';

const DocumentRequest = sequelize.define('DocumentRequest', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  personId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Person,
      key: 'id',
    },
  },
  trackingNumber: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
  },
  requestDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  orderType: {
    type: DataTypes.ENUM('Local', 'International', 'Legal Delegate'),
    defaultValue: 'Local',
  },
  institutionName: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  institutionAddress: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  mailingAgent: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  requestStatus: {
    type: DataTypes.ENUM('Pending', 'Approved', 'Rejected', 'Completed', 'Processing'),
    defaultValue: 'Pending',
  },
  documentType: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  // Additional fields for specific document types
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  grandfatherName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  idNo: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  mobileNumber: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  admissionType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  degreeType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  college: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  department: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  otherCollege: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otherCollegeText: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  otherDepartment: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  otherDepartmentText: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  studentStatus: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  sendWithinBITS: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // Original Degree specific fields
  firstNameAmharic: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  fatherNameAmharic: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  grandfatherNameAmharic: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  yearOfGraduationEC: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  yearOfGraduationGC: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  serviceType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  // Student Copy specific fields
  programType: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  yearOfStudy: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  semester: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  // Supporting Letter specific fields
  organizationName: {
    type: DataTypes.STRING(150),
    allowNull: true,
  },
  purpose: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  letterContent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  authorizedPerson: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  authorizedPhone: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  authorizedEmail: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  authorizedAddress: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'document_request',
  indexes: [
    {
      unique: true,
      fields: ['tracking_number'],
    },
    {
      fields: ['request_status'],
    },
    {
      fields: ['document_type'],
    },
    {
      fields: ['person_id'],
    },
  ],
});

// Define associations (use alias 'person' to match includes elsewhere)
DocumentRequest.belongsTo(Person, { foreignKey: 'personId', as: 'person' });
Person.hasMany(DocumentRequest, { foreignKey: 'personId', as: 'person' });

export default DocumentRequest;

