// photoRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp'); // For image optimization
const { Pool } = require('pg');
const router = express.Router();

// Database connection (adjust to your setup)
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/student-photos');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        try {
            await fs.mkdir(uploadsDir, { recursive: true });
            cb(null, uploadsDir);
        } catch (error) {
            cb(error);
        }
    },
    filename: (req, file, cb) => {
        // Generate unique filename: studentId_timestamp.extension
        const studentId = req.params.studentId || req.body.studentId;
        const timestamp = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `student_${studentId}_${timestamp}${extension}`);
    }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
    }
};

// Configure multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Middleware to verify JWT token (adjust to your auth system)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    // Verify token logic here (adjust to your JWT setup)
    // jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //     if (err) return res.status(403).json({ error: 'Invalid token' });
    //     req.user = user;
    //     next();
    // });
    
    // For now, just continue (replace with your auth logic)
    next();
};

// Helper function to optimize images
async function optimizeImage(filePath, outputPath) {
    try {
        await sharp(filePath)
            .resize(400, 400, { 
                fit: 'cover',
                position: 'center'
            })
            .jpeg({ quality: 85 })
            .toFile(outputPath);
        
        // Delete original if optimization successful
        await fs.unlink(filePath);
        return true;
    } catch (error) {
        console.error('Image optimization failed:', error);
        return false;
    }
}

// Upload photo for a student
router.post('/upload/:studentId', authenticateToken, upload.single('photo'), async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { studentId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No photo file provided' });
        }

        // Verify student exists
        const studentCheck = await client.query(
            'SELECT student_id FROM students WHERE student_id = $1',
            [studentId]
        );
        
        if (studentCheck.rows.length === 0) {
            // Delete uploaded file if student doesn't exist
            await fs.unlink(req.file.path);
            return res.status(404).json({ error: 'Student not found' });
        }

        // Optimize image
        const originalPath = req.file.path;
        const optimizedPath = originalPath.replace(path.extname(originalPath), '_optimized.jpg');
        
        const optimized = await optimizeImage(originalPath, optimizedPath);
        const finalPath = optimized ? optimizedPath : originalPath;
        const relativePath = path.relative(path.join(__dirname, '../'), finalPath);

        await client.query('BEGIN');

        // Deactivate any existing photos for this student
        await client.query(
            'UPDATE student_photos SET is_active = false WHERE student_id = $1',
            [studentId]
        );

        // Insert new photo record
        const insertResult = await client.query(
            `INSERT INTO student_photos (student_id, photo_path, original_filename, file_size, is_active) 
             VALUES ($1, $2, $3, $4, true) 
             RETURNING id, photo_path, upload_date`,
            [studentId, relativePath, req.file.originalname, req.file.size]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Photo uploaded successfully',
            photo: {
                id: insertResult.rows[0].id,
                path: relativePath,
                uploadDate: insertResult.rows[0].upload_date,
                url: `/api/photos/serve/${path.basename(finalPath)}`
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Photo upload error:', error);
        
        // Clean up uploaded file on error
        if (req.file) {
            try {
                await fs.unlink(req.file.path);
            } catch (unlinkError) {
                console.error('Failed to delete uploaded file:', unlinkError);
            }
        }
        
        res.status(500).json({ error: 'Failed to upload photo' });
    } finally {
        client.release();
    }
});

// Get student photo
router.get('/:studentId', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const result = await pool.query(
            `SELECT id, photo_path, original_filename, upload_date 
             FROM student_photos 
             WHERE student_id = $1 AND is_active = true`,
            [studentId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'No photo found for this student' });
        }

        const photo = result.rows[0];
        res.json({
            success: true,
            photo: {
                id: photo.id,
                path: photo.photo_path,
                filename: photo.original_filename,
                uploadDate: photo.upload_date,
                url: `/api/photos/serve/${path.basename(photo.photo_path)}`
            }
        });

    } catch (error) {
        console.error('Get photo error:', error);
        res.status(500).json({ error: 'Failed to retrieve photo' });
    }
});

// Serve photo files
router.get('/serve/:filename', (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(uploadsDir, filename);
    
    // Security: prevent directory traversal
    if (!filePath.startsWith(uploadsDir)) {
        return res.status(403).json({ error: 'Access denied' });
    }
    
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('File serve error:', err);
            res.status(404).json({ error: 'Photo not found' });
        }
    });
});

// Delete student photo
router.delete('/:studentId', authenticateToken, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { studentId } = req.params;
        
        await client.query('BEGIN');
        
        // Get current photo path
        const photoResult = await client.query(
            'SELECT photo_path FROM student_photos WHERE student_id = $1 AND is_active = true',
            [studentId]
        );
        
        if (photoResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'No active photo found' });
        }
        
        const photoPath = path.join(__dirname, '../', photoResult.rows[0].photo_path);
        
        // Deactivate photo in database
        await client.query(
            'UPDATE student_photos SET is_active = false WHERE student_id = $1',
            [studentId]
        );
        
        await client.query('COMMIT');
        
        // Delete physical file
        try {
            await fs.unlink(photoPath);
        } catch (fileError) {
            console.error('Failed to delete physical file:', fileError);
            // Don't fail the request if file deletion fails
        }
        
        res.json({
            success: true,
            message: 'Photo deleted successfully'
        });
        
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Delete photo error:', error);
        res.status(500).json({ error: 'Failed to delete photo' });
    } finally {
        client.release();
    }
});

// Get all photos for a student (including inactive ones)
router.get('/:studentId/history', authenticateToken, async (req, res) => {
    try {
        const { studentId } = req.params;
        
        const result = await pool.query(
            `SELECT id, photo_path, original_filename, upload_date, is_active 
             FROM student_photos 
             WHERE student_id = $1 
             ORDER BY upload_date DESC`,
            [studentId]
        );

        const photos = result.rows.map(photo => ({
            id: photo.id,
            path: photo.photo_path,
            filename: photo.original_filename,
            uploadDate: photo.upload_date,
            isActive: photo.is_active,
            url: `/api/photos/serve/${path.basename(photo.photo_path)}`
        }));

        res.json({
            success: true,
            photos: photos
        });

    } catch (error) {
        console.error('Get photo history error:', error);
        res.status(500).json({ error: 'Failed to retrieve photo history' });
    }
});

module.exports = router;