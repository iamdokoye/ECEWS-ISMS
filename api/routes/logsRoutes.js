const express = require('express');
const router = express.Router();
const logsController = require('../controllers/logsController');

// POST: Save or update log for a student on a specific date
router.post('/save', logsController.createOrUpdateLog);

// GET: Fetch all logs for a specific student
router.get('/:student_id', logsController.getAllLogsForStudent);

// POST: Mark a log as submitted
router.post('/submit', logsController.markLogAsSubmitted);

module.exports = router;
