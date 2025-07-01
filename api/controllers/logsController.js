// controllers/logsController.js
const {
  addLog,
  getLogsByStudent,
  getLogByDate,
  updateLog,
  submitLog
} = require('../models/logsModel.js');

const createOrUpdateLog = async (req, res) => {
  const { student_id, log_date, content } = req.body;

  if (!student_id || !log_date || !content) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const existingLog = await getLogByDate(student_id, log_date);
    if (existingLog) {
      const updated = await updateLog({ student_id, content, log_date });
      return res.status(200).json(updated);
    } else {
      const created = await addLog({ student_id, log_date, content });
      return res.status(201).json(created);
    }
  } catch (err) {
    console.error('Log create/update error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllLogsForStudent = async (req, res) => {
  const { student_id } = req.params;

  try {
    const logs = await getLogsByStudent(student_id);
    return res.status(200).json(logs);
  } catch (err) {
    console.error('Get logs error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const markLogAsSubmitted = async (req, res) => {
  const { student_id, log_date } = req.body;

  if (!student_id || !log_date) {
    return res.status(400).json({ message: 'Missing student ID or date' });
  }

  try {
    const submitted = await submitLog(student_id, log_date);
    return res.status(200).json(submitted);
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
