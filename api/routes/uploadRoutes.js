const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');
const { uploadMiddleware } = require('../config/multerConfig')

// POST: Upload image
router.post(
  '/upload',
  authMiddleware,
  uploadMiddleware, // ✅ This is what handles multipart/form-data
  uploadController.uploadImage
);

// GET: Fetch image
router.get(
  '/:imageId',
  authMiddleware,
  uploadController.getImage
);

module.exports = router;
