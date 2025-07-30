const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');
const verifyToken = require('../middleware/authMiddleware');


// Get logs
router.get('/all', verifyToken, logsController.getAllLogs);
// POST: Save or update log for a student on a specific date
router.post('/save', verifyToken, logsController.createOrUpdateLog);

// GET: Fetch all logs for a specific student
router.get('/', verifyToken, logsController.getAllLogsForStudent);

// POST: Mark a log as submitted
router.post('/submit', verifyToken, logsController.markLogAsSubmitted);

router.post('/submit-all', verifyToken, logsController.submitAllLogs);

// For supervisors to view specific student logs
router.get('/student/:studentId', verifyToken, logsController.getLogsForSpecificStudent);

module.exports = router;
