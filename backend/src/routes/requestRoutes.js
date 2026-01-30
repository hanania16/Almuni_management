import express from 'express';
import {
  createRequest,
  getAllRequests,
  getMyRequests,
  getRequestById,
  trackRequest,
  updateRequestStatus,
  updateRequest,
  deleteRequest,
  getStats,
} from '../controllers/requestController.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../controllers/uploadController.js';

const router = express.Router();

// Public routes
router.get('/track/:trackingNumber', trackRequest);

// Public route to create a new document request (students can submit without auth)
// Accept any file field names so forms can upload `costSharingLetter`, `otherDocuments`, etc.
router.post('/', upload.any(), createRequest);
router.get('/my', protect, getMyRequests);
router.get('/stats', protect, adminOnly, getStats);

// Admin routes
router.get('/', protect, adminOnly, getAllRequests);
router.put('/:id/status', protect, adminOnly, updateRequestStatus);
router.put('/:id', protect, adminOnly, updateRequest);
router.delete('/:id', protect, adminOnly, deleteRequest);

// Common routes (must be after specific routes)
router.get('/:id', protect, getRequestById);

export default router;

