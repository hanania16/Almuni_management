import express from 'express';
import {
  getStats,
  getUsers,
  updateUser,
  deleteUser,
  getAllRequests,
  updateRequest,
  deleteRequest,
} from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect, adminOnly);

// Dashboard stats
router.get('/stats', getStats);

// User management
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Request management
router.get('/requests', getAllRequests);
router.put('/requests/:id', updateRequest);
router.delete('/requests/:id', deleteRequest);

export default router;

