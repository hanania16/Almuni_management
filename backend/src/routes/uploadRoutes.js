import express from 'express';
import { upload, uploadFiles, deleteFile, getFile } from '../controllers/uploadController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Allow public uploads for form submissions (no auth required)
// Accept any file field names for flexibility
router.post('/', upload.any(), uploadFiles);
router.delete('/:filename', protect, adminOnly, deleteFile);
router.get('/:filename', getFile);

export default router;

