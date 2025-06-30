// routes/logsRoutes.js
const express = require('express');
const router = express.Router();
const {
  createOrUpdateLog,
  getAllLogsForStudent,
  markLogAsSubmitted
} = require('../controllers/logsController');

router.post('/log', createOrUpdateLog); // Create or update a log
router.get('/log/:student_id', getAllLogsForStudent); // Get all logs for a student
router.put('/log/submit', markLogAsSubmitted); // Submit a log

module.exports = router;
