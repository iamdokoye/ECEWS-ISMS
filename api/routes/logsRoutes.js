// routes/logsRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrUpdateLog,
  getAllLogsForStudent,
  markLogAsSubmitted
} = require('../controllers/logsController');

router.post('/create', createOrUpdateLog); // Create or update a log
router.get('/:student_id', getAllLogsForStudent); // Get all logs for a student
router.put('/submit', markLogAsSubmitted); // Submit a log

module.exports = router;
