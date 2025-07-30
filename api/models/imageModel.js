const pool = require('../config/database');

class ImageModel {
  static async create(imageData) {
    const { studentId, filePath, mimeType, fileSize, isProfile } = imageData;
    
    const result = await pool.query(
      `INSERT INTO student_images 
       (student_id, file_path, mime_type, file_size, is_profile_picture)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [studentId, filePath, mimeType, fileSize, isProfile]
    );
    
    return result.rows[0];
  }

  static async findByStudent(studentId) {
    const result = await pool.query(
      `SELECT * FROM student_images 
       WHERE student_id = $1
       ORDER BY uploaded_at DESC`,
      [studentId]
    );
    
    return result.rows;
  }
}

module.exports = ImageModel;