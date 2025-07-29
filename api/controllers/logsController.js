const {
  addLog,
  getLogs,
  getLogsByStudent,
  getLogByDate,
  updateLog,
  submitLog,
  getUnsubmittedLogs,
  submitAllUnsubmittedLogs
} = require('../models/logsModel.js');

const createOrUpdateLog = async (req, res) => {
  const { student_id, log_date, content } = req.body;

  // Debug log to see if student_id is coming correctly
  console.log("Received student_id:", student_id);
  console.log("Received log_date:", log_date);
  console.log("Received content:", content);

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
    // Log the error message for debugging
    console.error('Log create/update error:', err);
    // Send a meaningful message back to the client
    return res.status(500).json({ message: `Error saving log: ${err.message}` });
  }
};

// Fetch all logs
const getAllLogs = async (req, res) => {
  try {
    const logs = await getLogs();
    if (logs.length === 0) {
      return res.status(404).json({ message: 'No logs found' });
    }
    return res.status(200).json(logs);
  } catch (err) {
    console.error('Get all logs error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Fetch all logs for a specific student
const getAllLogsForStudent = async (req, res) => {
const { student_id } = req.params;

  // Check if the student_id is provided
  if (!student_id || student_id === 'undefined') {
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

const submitAllLogs = async (req, res) => {
    try {
        const student_id = req.user.id; // Assuming user ID is in the token
        
        // Get all unsubmitted logs for this student
        const unsubmittedLogs = await getUnsubmittedLogs(student_id);
        
        if (unsubmittedLogs.length === 0) {
            return res.status(200).json({ 
                message: 'All logs were already submitted' 
            });
        }

        // Submit all unsubmitted logs
        const result = await submitAllUnsubmittedLogs(student_id);
        
        res.status(200).json({
            message: `Successfully submitted ${result.rowCount} logs`,
            count: result.rowCount
        });
    } catch (err) {
        console.error('Submit all logs error:', err);
        res.status(500).json({ message: 'Error submitting logs' });
    }
};

module.exports = {
  createOrUpdateLog,
  getAllLogs,
  getAllLogsForStudent,
  markLogAsSubmitted,
  submitAllLogs
};
