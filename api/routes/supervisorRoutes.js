const express = require('express');
const router = express.Router();
const pool = require('../config/database');
const verifyToken = require('../middleware/authMiddleware');
const { getStudentsForSupervisor } = require('../controllers/supervisorController');
const {
  getUnits,
  getUsersByUnit,
  assignSupervisor
} = require('../controllers/assignSupervisorController');

// GET /api/units - fetch units from external pool
router.get('/units', getUnits);

// GET /api/users/by-unit/:unit - fetch users from external pool by unit
router.get('/users/by-unit/:unit', getUsersByUnit);

// POST /api/assign-supervisor - assign supervisor into internal pool
router.post('/assign', assignSupervisor);

router.get('/my-students', verifyToken, getStudentsForSupervisor);

router.post('/sign-log', verifyToken, async (req, res) => {
    const client = await pool.connect();
    
    try {
        const { studentId, comment, signature, month, week } = req.body;
        
        // Validate required fields
        if (!studentId || !comment || !signature || !month || !week) {
            return res.status(400).json({ 
                error: 'Missing required fields: studentId, comment, signature, month, week' 
            });
        }

        // Validate month and week ranges
        if (month < 1 || month > 12 || week < 1 || week > 4) {
            return res.status(400).json({ 
                error: 'Invalid month (1-12) or week (1-4)' 
            });
        }

        // Verify student exists
        const studentCheck = await client.query(
            'SELECT student_id FROM students WHERE student_id = $1',
            [studentId]
        );
        
        if (studentCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        await client.query('BEGIN');

        // Insert or update signature record
        const result = await client.query(
            `INSERT INTO supervisor_signatures (student_id, month, week, comment, signature_data, supervisor_id, updated_at) 
             VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
             ON CONFLICT (student_id, month, week) 
             DO UPDATE SET 
                comment = EXCLUDED.comment,
                signature_data = EXCLUDED.signature_data,
                supervisor_id = EXCLUDED.supervisor_id,
                updated_at = CURRENT_TIMESTAMP
             RETURNING id, created_at, updated_at`,
            [studentId, month, week, comment, signature, req.user?.id || null]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Signature saved successfully',
            data: {
                id: result.rows[0].id,
                studentId,
                month,
                week,
                createdAt: result.rows[0].created_at,
                updatedAt: result.rows[0].updated_at
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Save signature error:', error);
        res.status(500).json({ error: 'Failed to save signature' });
    } finally {
        client.release();
    }
});

router.get('/sign-log/:studentId/:month/:week', verifyToken, async (req, res) => {
    try {
        const { studentId, month, week } = req.params;

        // Validate parameters
        if (!studentId || !month || !week) {
            return res.status(400).json({ error: 'Missing studentId, month, or week' });
        }

        const result = await pool.query(
            `SELECT id, comment, signature_data, supervisor_id, created_at, updated_at
             FROM supervisor_signatures 
             WHERE student_id = $1 AND month = $2 AND week = $3`,
            [studentId, parseInt(month), parseInt(week)]
        );

        if (result.rows.length === 0) {
            return res.json({ 
                signed: false,
                message: 'No signature found for this week'
            });
        }

        const signature = result.rows[0];
        res.json({
            signed: true,
            comment: signature.comment,
            signature: signature.signature_data,
            supervisorId: signature.supervisor_id,
            createdAt: signature.created_at,
            updatedAt: signature.updated_at
        });

    } catch (error) {
        console.error('Get signature error:', error);
        res.status(500).json({ error: 'Failed to retrieve signature' });
    }
});

// GET /api/supervisor/sign-log/:studentId - Get all signatures for a student
router.get('/sign-log/:studentId', verifyToken, async (req, res) => {
    try {
        const { studentId } = req.params;

        const result = await pool.query(
            `SELECT id, month, week, comment, signature_data, supervisor_id, created_at, updated_at
             FROM supervisor_signatures 
             WHERE student_id = $1 
             ORDER BY month, week`,
            [studentId]
        );

        const signatures = result.rows.map(sig => ({
            id: sig.id,
            month: sig.month,
            week: sig.week,
            comment: sig.comment,
            signature: sig.signature_data,
            supervisorId: sig.supervisor_id,
            createdAt: sig.created_at,
            updatedAt: sig.updated_at
        }));

        res.json({
            success: true,
            signatures
        });

    } catch (error) {
        console.error('Get all signatures error:', error);
        res.status(500).json({ error: 'Failed to retrieve signatures' });
    }
});

// DELETE /api/supervisor/sign-log/:studentId/:month/:week - Delete signature for specific week
router.delete('/sign-log/:studentId/:month/:week', verifyToken, async (req, res) => {
    try {
        const { studentId, month, week } = req.params;

        const result = await pool.query(
            'DELETE FROM supervisor_signatures WHERE student_id = $1 AND month = $2 AND week = $3 RETURNING id',
            [studentId, parseInt(month), parseInt(week)]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Signature not found' });
        }

        res.json({
            success: true,
            message: 'Signature deleted successfully'
        });

    } catch (error) {
        console.error('Delete signature error:', error);
        res.status(500).json({ error: 'Failed to delete signature' });
    }
});

// GET /api/supervisor/students/:studentId/signature-status - Get signature status overview
router.get('/students/:studentId/signature-status', verifyToken, async (req, res) => {
    try {
        const { studentId } = req.params;

        const result = await pool.query(
            `SELECT month, week, created_at
             FROM supervisor_signatures 
             WHERE student_id = $1 
             ORDER BY month, week`,
            [studentId]
        );

        // Create a map of signed weeks
        const signedWeeks = {};
        result.rows.forEach(sig => {
            if (!signedWeeks[sig.month]) {
                signedWeeks[sig.month] = {};
            }
            signedWeeks[sig.month][sig.week] = {
                signed: true,
                signedAt: sig.created_at
            };
        });

        res.json({
            success: true,
            studentId,
            signedWeeks
        });

    } catch (error) {
        console.error('Get signature status error:', error);
        res.status(500).json({ error: 'Failed to get signature status' });
    }
});



module.exports = router;
