import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Person = sequelize.define('Person', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  fatherName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  grandfatherName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  idNumber: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  mobileNumber: {
    type: DataTypes.STRING(20),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
  },
  studentStatus: {
    type: DataTypes.ENUM('Active', 'Inactive', 'Graduated'),
    defaultValue: 'Graduated',
  },
  departmentName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  admissionTypeName: {
    type: DataTypes.ENUM('Regular', 'Evening', 'Summer', 'Distance'),
    defaultValue: 'Regular',
  },
  degreeTypeName: {
    type: DataTypes.ENUM('Degree', "Master's"),
    allowNull: true,
  },
  graduationYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  graduationCalendar: {
    type: DataTypes.ENUM('EC', 'GC'),
    allowNull: true,
  },
}, {
  tableName: 'person',
  indexes: [
    {
      unique: true,
      fields: ['email'],
    },
    {
      fields: ['student_status'],
    },
  ],
});

export default Person;

