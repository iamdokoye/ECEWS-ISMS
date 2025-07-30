const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const authMiddleware = require('../middleware/authMiddleware');

router.post(
  '/upload',
  authMiddleware,
  uploadController.uploadImage
);

router.get(
  '/:imageId',
  authMiddleware,
  uploadController.getImage
);

module.exports = router;