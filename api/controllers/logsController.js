const {
  addLog,
  getLogsByStudent,
  getLogByDate,
  updateLog,
  submitLog
} = require('../models/logsModel.js');

const createOrUpdateLog = async (req, res) => {
  const { student_id, log_date, content } = req.body;

  // Check for missing fields
  if (!student_id || !log_date || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if the log already exists for this student and date
    const existingLog = await getLogByDate(student_id, log_date);
    
    if (existingLog) {
      // If log exists, update it
      const updated = await updateLog({ student_id, content, log_date });
      return res.status(200).json(updated);
    } else {
      // If no log exists, create a new one
      const created = await addLog({ student_id, log_date, content });
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('Log create/update error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all logs for a specific student
const getAllLogsForStudent = async (req, res) => {
  const { student_id } = req.params;

  // Check if the student_id is provided
  if (!student_id) {
    return res.status(400).json({ message: 'Missing student ID' });
  }

  try {
    const logs = await getLogsByStudent(student_id);
    if (logs.length === 0) {
      return res.status(404).json({ message: 'No logs found for this student' });
    }
    return res.status(200).json(logs);
  } catch (err) {
    console.error('Get logs error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Mark a specific log as submitted (for confirmation)
const markLogAsSubmitted = async (req, res) => {
  const { student_id, log_date } = req.body;

  // Check for missing fields
  if (!student_id || !log_date) {
    return res.status(400).json({ message: 'Missing student ID or date' });
  }

  try {
    const submitted = await submitLog(student_id, log_date);
    if (submitted) {
      return res.status(200).json({ message: 'Log successfully submitted' });
    } else {
      return res.status(404).json({ message: 'Log not found for submission' });
    }
  } catch (err) {
    console.error('Submit log error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createOrUpdateLog,
  getAllLogsForStudent,
  markLogAsSubmitted
};
