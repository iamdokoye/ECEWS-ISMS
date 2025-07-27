const pool = require('../db/database');



// Create a new student record (called after HR adds a student user)

const addStudent = async ({
  student_id,
  supervisor_id,
  duration,
  name,
  institution,
  level,
  interest,
  course_of_study,
  gender,
  startDate,
  endDate

}) => {
  const result = await pool.query(
    `
    INSERT INTO students (
    student_id,
    supervisor_id,
    duration,
    name,
    institution,
    level,
    interest,
    course_of_study,
    gender,
    startdate,
    enddate
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [student_id, supervisor_id, duration, name, institution, level, interest, course_of_study, gender, startDate, endDate]
  );
  return result.rows[0];
};

const userFields = ['name', 'email', 'unit']; // Add all user table fields here
const studentFields = [
  'duration', 'institution', 'level', 'interest', 'course_of_study',
  'gender', 'startDate', 'endDate', 'it_status', 'supervisor_id', 'name'
  // Add all student table fields here
];

// Update student information
const updateStudentRecord = async (studentId, updates) => {
  // Split updates into users and students fields
  const userUpdates = {};
  const studentUpdates = {};

  for (const [key, value] of Object.entries(updates)) {
    if (userFields.includes(key)) userUpdates[key] = value;
    if (studentFields.includes(key)) studentUpdates[key] = value;
  }

  // Update users table if needed
  if (Object.keys(userUpdates).length > 0) {
    // Get user id from students table
    const { rows } = await pool.query('SELECT student_id FROM students WHERE student_id = $1', [studentId]);
    if (rows.length === 0) throw new Error('Student not found');
    const userId = rows[0].student_id;

    const setClause = Object.keys(userUpdates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(userUpdates);
    await pool.query(
      `UPDATE users SET ${setClause} WHERE id = $${values.length + 1}`,
      [...values, userId]
    );
  }

  // Update students table if needed
  if (Object.keys(studentUpdates).length > 0) {
    const setClause = Object.keys(studentUpdates).map((key, i) => `${key} = $${i + 1}`).join(', ');
    const values = Object.values(studentUpdates);
    await pool.query(
      `UPDATE students SET ${setClause} WHERE student_id = $${values.length + 1}`,
      [...values, studentId]
    );
  }

  // Optionally, return the updated student record
  const { rows: [updatedStudent] } = await pool.query(
    `SELECT * FROM students WHERE student_id = $1`, [studentId]
  );
  return updatedStudent;
};

// Get all students (optionally join with supervisor info)
const getAllStudents = async () => {
  const result = await pool.query(`
    SELECT 
      s.id,
      u.name AS student_name,
      u.email AS student_email,
      s.duration,
      s.it_status,
      s.created_at,
      s.institution
      s.level,
      s.interest,
      s.course_of_study,
      s.gender,
      s.startdate,
      s.enddate,
      sup.name AS supervisor_name,
      sup.email AS supervisor_email
    FROM students s
    JOIN users u ON s.student_id = u.id
    LEFT JOIN users sup ON s.supervisor_id = sup.id
    ORDER BY s.created_at DESC
  `);
  return result.rows;
};

// Get students by supervisor
const getStudentsBySupervisor = async (supervisor_id) => {
  const result = await pool.query(`
    SELECT 
      s.id,
      u.name AS student_name,
      u.email AS student_email,
      s.duration,
      s.it_status,
      s.created_at
    FROM students s
    JOIN users u ON s.student_id = u.id
    WHERE s.supervisor_id = $1
    ORDER BY s.created_at DESC
  `, [supervisor_id]);
  return result.rows;
};

const getStudentsByUnit = async (unit, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const result = await pool.query(
      `SELECT * FROM students s
        JOIN users u ON s.student_id = u.id
        WHERE unit = $1
        ORDER BY s.created_at DESC
        LIMIT $2 OFFSET $3`,
      [unit, limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error('Error in getStudentsByUnit:', err);
    throw err;
  }
};

// Update student IT status (active/inactive)
const updateStudentStatus = async (student_id, new_status) => {
  const result = await pool.query(`
    UPDATE students
    SET it_status = $1
    WHERE student_id = $2
    RETURNING *
  `, [new_status, student_id]);
  return result.rows[0];
};

module.exports = {
  addStudent,
  getAllStudents,
  getStudentsBySupervisor,
  getStudentsByUnit,
  updateStudentStatus,
  updateStudentRecord
};
