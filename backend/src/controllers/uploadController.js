import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create date-based folder for organization
    const dateFolder = new Date().toISOString().split('T')[0];
    const fullPath = path.join(uploadDir, dateFolder);
    
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
    
    cb(null, fullPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doc-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, images, and Word documents are allowed.'), false);
  }
};

// Create upload middleware
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// @desc    Upload files
// @route   POST /api/upload
// @access  Private
export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const files = req.files.map((file) => ({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: file.path,
      url: `/uploads/${path.basename(path.dirname(file.path))}/${file.filename}`,
    }));

    res.json({
      success: true,
      data: files,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading files',
      error: error.message,
    });
  }
};

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private
export const deleteFile = async (req, res) => {
  try {
    const { filename } = req.params;

    // Find and delete file
    const files = fs.readdirSync(uploadDir);
    let deleted = false;

    for (const folder of files) {
      const folderPath = path.join(uploadDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const filePath = path.join(folderPath, filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deleted = true;
          break;
        }
      }
    }

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting file',
      error: error.message,
    });
  }
};

// @desc    Get uploaded file
// @route   GET /api/upload/:filename
// @access  Public
export const getFile = async (req, res) => {
  try {
    const { filename } = req.params;

    // Search for file
    const files = fs.readdirSync(uploadDir);
    let filePath = null;

    for (const folder of files) {
      const folderPath = path.join(uploadDir, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const potentialPath = path.join(folderPath, filename);
        if (fs.existsSync(potentialPath)) {
          filePath = potentialPath;
          break;
        }
      }
    }

    if (!filePath) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.sendFile(path.resolve(filePath));
  } catch (error) {
    console.error('Get file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving file',
      error: error.message,
    });
  }
};

