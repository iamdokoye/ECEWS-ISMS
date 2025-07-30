const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('./database');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads/students');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = `student-${req.user.id}-${Date.now()}${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG/PNG images allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Save image metadata to database
const saveImageRecord = async (studentId, file) => {
  const { filename, path: filePath, size, mimetype } = file;
  
  const result = await pool.query(
    `INSERT INTO student_images 
     (student_id, file_name, file_path, file_size, mime_type)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [studentId, filename, filePath, size, mimetype]
  );
  
  return result.rows[0];
};

// Get image by ID
const getImage = async (imageId, studentId) => {
  const result = await pool.query(
    `SELECT * FROM student_images 
     WHERE image_id = $1 AND student_id = $2`,
    [imageId, studentId]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Image not found');
  }
  
  return result.rows[0];
};

module.exports = {
  uploadMiddleware: upload.single('image'),
  saveImageRecord,
  getImage
};