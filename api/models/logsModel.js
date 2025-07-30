const pool = require('../db/database');

// Add a new log
const addLog = async ({ student_id, log_date, content }) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Validate student exists
    const studentCheck = await client.query(
      'SELECT 1 FROM students WHERE student_id = $1', 
      [student_id]
    );
    
    if (studentCheck.rowCount === 0) {
      throw new Error('Student not found');
    }

    // Validate date
    const parsedDate = new Date(log_date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Invalid date format');
    }

    // Insert log
    const result = await client.query(
      `INSERT INTO logs (student_id, log_date, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [student_id, parsedDate.toISOString(), content]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Database error:', err);
    throw err;
  } finally {
    client.release();
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

const getUnsubmittedLogs = async (student_id) => {
    const result = await pool.query(
        `SELECT * FROM logs 
         WHERE student_id = $1 AND is_submitted = false`,
        [student_id]
    );
    return result.rows;
};

const submitAllUnsubmittedLogs = async (student_id) => {
    const result = await pool.query(
        `UPDATE logs 
         SET is_submitted = true, submitted_at = NOW() 
         WHERE student_id = $1 AND is_submitted = false
         RETURNING *`,
        [student_id]
    );
    return result;
};

module.exports = {
  addLog,
  getLogs,
  getLogsByStudent,
  getLogByDate,
  updateLog,
  submitLog,
  getUnsubmittedLogs,
  submitAllUnsubmittedLogs
};
