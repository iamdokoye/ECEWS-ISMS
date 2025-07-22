const pool = require('../db/database');

// Add a new log
const addLog = async ({ student_id, log_date, content }) => {
  try {
    // Check if the studentIdInt exists in the students table
    const studentIdInt = student_id;
    const studentCheck = await pool.query('SELECT 1 FROM students WHERE student_id = $1', [studentIdInt]);
    if (studentCheck.rowCount === 0) {
      throw new Error(`Student with ID ${studentIdInt} does not exist`);
    }

    // Proceed with adding the log
    const result = await pool.query(
      'INSERT INTO logs (student_id, log_date, content) VALUES ($1, $2, $3) RETURNING *',
      [student_id, log_date, content]
    );
    console.log('Log added successfully:', result.rows[0]);
    console.log("addLog called with:", { student_id, log_date, content });
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting log:', err);
    throw err;
  }
};

// Get all logs
const getLogs = async () => {
  try {
    const result = await pool.query('SELECT * FROM logs ORDER BY log_date DESC');
    return result.rows;
  } catch (err) {
    console.error('Error fetching logs:', err);
    throw err;
  }
};

// Get all logs for a student
const getLogsByStudent = async (student_id) => {
  try {
    const result = await pool.query(
      `SELECT * FROM logs
     WHERE student_id = $1
     ORDER BY log_date DESC`,
      [student_id]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching logs:', err);
    throw err;
  }
};

// Get a single log by date
const getLogByDate = async (student_id, log_date) => {
  try {
    const result = await pool.query(
      `SELECT * FROM logs
             WHERE student_id = $1 AND DATE(log_date) = $2`,
      [student_id, log_date]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching logs:', err);
    throw err;
  }
};

// Update a log
const updateLog = async ({ student_id, log_date, content }) => {
  try {
    const result = await pool.query(
      `UPDATE logs
     SET content = $2, updated_at = CURRENT_TIMESTAMP
     WHERE student_id = $1 AND log_date = $3
     RETURNING *`,
      [student_id, content, log_date]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching logs:', err);
    throw err;
  }
};

// Submit a log (mark as submitted)
const submitLog = async (student_id, log_date) => {
  try {
    const result = await pool.query(
      `UPDATE logs
     SET is_submitted = true, updated_at = CURRENT_TIMESTAMP
     WHERE student_id = $1 AND log_date = $2
     RETURNING *`,
      [student_id, log_date]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching logs:', err);
    throw err;
  }
};

module.exports = {
  addLog,
  getLogs,
  getLogsByStudent,
  getLogByDate,
  updateLog,
  submitLog
};
