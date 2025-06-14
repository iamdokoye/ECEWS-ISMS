const internalDb = require('../db/internalDB');

// Create a new student record (called after HR adds a student user)
const addStudent = async ({ student_id, supervisor_id = null, added_by_hr, duration = 6 }) => {
  const result = await internalDb.query(
    `INSERT INTO students (student_id, supervisor_id, added_by_hr, duration)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [student_id, supervisor_id, added_by_hr, duration]
  );
  return result.rows[0];
};

// Get all students (optionally join with supervisor info)
const getAllStudents = async () => {
  const result = await internalDb.query(`
    SELECT 
      s.id,
      u.name AS student_name,
      u.email AS student_email,
      s.duration,
      s.it_status,
      s.created_at,
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
  const result = await internalDb.query(`
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

// Update student IT status (active/inactive)
const updateStudentStatus = async (student_id, new_status) => {
  const result = await internalDb.query(`
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
  updateStudentStatus,
};
