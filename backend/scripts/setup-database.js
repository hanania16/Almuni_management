import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { sequelize } from '../src/config/database.js';
import User from '../src/models/User.js';
import Person from '../src/models/Person.js';
import DocumentRequest from '../src/models/DocumentRequest.js';
import AttachedDocument from '../src/models/AttachedDocument.js';
import Payment from '../src/models/Payment.js';

dotenv.config();

const createDatabase = async () => {
  let connection;

  try {
    console.log('🔄 Connecting to MySQL server...');

    // Connect without database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'alumni_management';

    // Create database if not exists
    console.log(`🔄 Creating database "${dbName}" if not exists...`);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ Database "${dbName}" ready`);

    // Close initial connection
    await connection.end();

    // Test Sequelize connection
    console.log('🔄 Testing Sequelize connection...');
    await sequelize.authenticate();
    console.log('✅ Sequelize connection established');

    // Sync all models
    console.log('🔄 Synchronizing database models...');
    await sequelize.sync({ alter: true });
    console.log('Database models synchronized');

    // Create admin user if not exists
    console.log('Creating admin user...');
    const adminEmail = 'admin@bits.edu';
    const adminPassword = 'admin123';

    const existingAdmin = await User.findOne({ where: { email: adminEmail } });

    if (!existingAdmin) {
      await User.create({
        name: 'Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });
      console.log('Admin user created');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      console.log('ℹAdmin user already exists');
    }

    // Create sample student for testing
    console.log('🔄 Creating sample student...');
    const sampleEmail = 'student@bits.edu';
    const samplePassword = 'student123';

    const existingStudent = await User.findOne({ where: { email: sampleEmail } });

    if (!existingStudent) {
      const student = await User.create({
        name: 'John Doe',
        email: sampleEmail,
        password: samplePassword,
        role: 'student',
        bitsId: '2020A7PS0001P',
        isActive: true,
      });

      await Person.create({
        firstName: 'John',
        fatherName: 'Smith',
        grandfatherName: 'Johnson',
        email: sampleEmail,
        mobileNumber: '+251911234567',
        studentStatus: 'Graduated',
        departmentName: 'Software Engineering',
        admissionTypeName: 'Regular',
        degreeTypeName: 'Degree',
        graduationYear: 2024,
        graduationCalendar: 'EC',
      });

      console.log('✅ Sample student created');
      console.log(`   Email: ${sampleEmail}`);
      console.log(`   Password: ${samplePassword}`);
      console.log(`   BITS ID: 2020A7PS0001P`);
    } else {
      console.log('ℹSample student already exists');
    }

    console.log('\nDatabase setup completed successfully!');
    console.log('\nTo start the server:');
    console.log('  npm run dev');
    console.log('\nOr to start in production:');
    console.log('  npm start');

  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
    await sequelize.close();
  }
};

createDatabase();

