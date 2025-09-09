const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage - using memory storage for image processing
const storage = multer.memoryStorage();

// File filter to only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit (will be compressed)
  }
});

// Function to generate unique filename
const generateFilename = (originalname) => {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
  return 'image-' + uniqueSuffix + '.jpg'; // Always save as .jpg after compression
};

module.exports = { upload, generateFilename };
