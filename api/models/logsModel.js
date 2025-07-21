const pool = require('../db/database');

// Add a new log
const addLog = async ({ student_id, log_date, content }) => {
  try {
    // Check if the student_id exists in the students table
    const student_id = parseInt(req.body.student_id, 10);
    const studentCheck = await pool.query('SELECT 1 FROM students WHERE student_id = $1', [student_id]);

    if (studentCheck.rowCount === 0) {
      throw new Error(`Student with ID ${student_id} does not exist`);
    }

    // Proceed with adding the log
    const result = await pool.query(
      'INSERT INTO logs (student_id, log_date, content) VALUES ($1, $2, $3) RETURNING *',
      [student_id, log_date, content]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Error inserting log:', err);
    throw err;
  }
};

// Get all logs for a student
const getLogsByStudent = async (student_id) => {
  const result = await pool.query(
    `SELECT * FROM logs
     WHERE student_id = $1
     ORDER BY log_date DESC`,
    [student_id]
  );
  return result.rows;
};

// Get a single log by date
const getLogByDate = async (student_id, log_date) => {
  const result = await pool.query(
    `SELECT * FROM logs
     WHERE student_id = $1 AND log_date = $2`,
    [student_id, log_date]
  );
  return result.rows[0];
};

// Update a log
const updateLog = async ({ student_id, log_date, content }) => {
  const result = await pool.query(
    `UPDATE logs
     SET content = $2, updated_at = CURRENT_TIMESTAMP
     WHERE student_id = $1 AND log_date = $3
     RETURNING *`,
    [student_id, content, log_date]
  );
  return result.rows[0];
};

// Submit a log (mark as submitted)
const submitLog = async (student_id, log_date) => {
  const result = await pool.query(
    `UPDATE logs
     SET is_submitted = true, updated_at = CURRENT_TIMESTAMP
     WHERE student_id = $1 AND log_date = $2
     RETURNING *`,
    [student_id, log_date]
  );
  return result.rows[0];
};

module.exports = {
  addLog,
  getLogsByStudent,
  getLogByDate,
  updateLog,
  submitLog
};
