import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import { testConnection, sequelize } from './config/database.js';
import User from './models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));

// Ensure OPTIONS preflight is handled and always returns appropriate CORS headers
app.options('*', cors());

// Fallback middleware to set CORS headers on all responses (helps when some middleware returns 204)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API documentation endpoint
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Alumni Management System API',
    version: '1.0.0',
    endpoints: {
      auth: {
        'POST /api/auth/register': 'Register a new student',
        'POST /api/auth/login': 'Login user',
        'POST /api/auth/logout': 'Logout user',
        'GET /api/auth/me': 'Get current user',
        'PUT /api/auth/profile': 'Update user profile',
        'PUT /api/auth/password': 'Change password',
      },
      requests: {
        'GET /api/requests/track/:trackingNumber': 'Track request by tracking number (public)',
        'POST /api/requests': 'Create new document request',
        'GET /api/requests/my': 'Get current student\'s requests',
        'GET /api/requests': 'Get all requests (admin only)',
        'GET /api/requests/:id': 'Get request by ID',
        'PUT /api/requests/:id/status': 'Update request status (admin only)',
        'PUT /api/requests/:id': 'Update request (admin only)',
        'DELETE /api/requests/:id': 'Delete request (admin only)',
        'GET /api/requests/stats': 'Get request statistics (admin only)',
      },
      admin: {
        'GET /api/admin/stats': 'Get dashboard statistics',
        'GET /api/admin/users': 'Get all users',
        'PUT /api/admin/users/:id': 'Update user',
        'DELETE /api/admin/users/:id': 'Deactivate user',
        'GET /api/admin/requests': 'Get all requests',
        'PUT /api/admin/requests/:id': 'Update request',
        'DELETE /api/admin/requests/:id': 'Delete request',
      },
      upload: {
        'POST /api/upload': 'Upload files',
        'GET /api/upload/:filename': 'Get uploaded file',
        'DELETE /api/upload/:filename': 'Delete uploaded file',
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File too large. Maximum size is 10MB.',
    });
  }

  if (err.message && err.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // Sequelize errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      message: 'A record with this value already exists.',
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error: ' + err.errors.map(e => e.message).join(', '),
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired',
    });
  }

  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Sync database models
    try {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synchronized (alter)');
    } catch (syncErr) {
      // Handle cases where ALTER fails (constraints, too many keys, etc.)
      console.warn('⚠️ Model sync with alter failed:', syncErr.code || syncErr.name || syncErr.message);
      console.warn('Attempting fallback sync without alter to recover from schema mismatch');
      try {
        await sequelize.sync();
        console.log('✅ Database models synchronized (fallback)');
      } catch (fallbackErr) {
        console.error('❌ Fallback sync also failed:', fallbackErr.code || fallbackErr.name || fallbackErr.message);
        throw fallbackErr;
      }
    }

    // Ensure default admin exists
    const createDefaultAdmin = async () => {
      try {
        const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@bits.edu';
        const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
        const existing = await User.findOne({ where: { email: adminEmail } });
        if (!existing) {
          await User.create({
            name: 'Administrator',
            email: adminEmail,
            password: adminPassword,
            role: 'admin',
            isActive: true,
          });
          console.log(`✅ Default admin created (${adminEmail})`);
        } else {
          console.log('ℹ️ Default admin already exists');
        }
      } catch (err) {
        console.error('Failed to create default admin:', err && err.message ? err.message : err);
      }
    };

    await createDefaultAdmin();

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API documentation: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();

export default app;

