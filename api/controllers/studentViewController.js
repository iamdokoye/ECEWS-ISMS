const pool = require('../db/database');
const { updateStudent, getStudentById } = require('../models/studentModel');

// Update student information
const updateStudentInfo = async (req, res) => {
  const { student_id } = req.params;
  const {
    name,
    institution,
    level,
    course_of_study,
    gender,
    startDate,
    duration,
    supervisor_id,
    interest,
    it_status
  } = req.body;

  try {
    // Get existing student data
    const existingStudent = await getStudentById(student_id);
    if (!existingStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Prepare update fields
    const updateFields = {
      name: name || undefined,
      institution: institution || undefined,
      level: level || undefined,
      course_of_study: course_of_study || undefined,
      gender: gender || undefined,
      startDate: startDate || undefined,
      duration: duration || undefined,
      supervisor_id: supervisor_id || undefined,
      interest: interest || undefined,
      it_status: it_status || undefined
    };

    // Update student
    const updatedStudent = await updateStudent(student_id, updateFields);

    return res.status(200).json({
      message: 'Student updated successfully',
      student: updatedStudent
    });
  } catch (err) {
    console.error('Error updating student:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
            students.student_id,
            students.institution,
            students.level,
            students.course_of_study,
            students.duration,
            students.it_status,
            students.created_at,
            students.interest,
            users.name,
            users.email,
            users.unit
            FROM students
            JOIN users ON students.student_id = users.id
            ORDER BY students.created_at DESC;
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching all students:', err);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
};

const getStudentDetails = async (req, res) => {
    const { id } = req.params;
    if (!id || id === 'undefined') {
        return res.status(400).json({ message: 'Invalid student ID' });
    }
    try {
        const result = await pool.query(`
            SELECT 
                u.name, u.email, u.unit, s.interest, s.level, s.institution, s.course_of_study, s.duration, s.created_at,
                sup.name AS supervisor
            FROM users u
            JOIN students s ON u.id = s.student_id
            LEFT JOIN users sup ON s.supervisor_id = sup.id
            WHERE s.student_id = $1
        `, [id]);

        if (result.rows.length === 0) return res.status(404).json({ message: 'Student not found' });
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching student details:', err);
        res.status(500).json({ message: 'Failed to fetch student details' });
    }
};

module.exports = { getAllStudents, getStudentDetails, updateStudentInfo };