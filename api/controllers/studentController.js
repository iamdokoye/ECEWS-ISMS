const pool = require('../config/database');
const { updateStudentRecord } = require('../models/studentModel');

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
            students.startdate,
            students.enddate,
            students.gender,
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
                u.name, u.email, u.unit, s.interest, s.level, s.institution, s.course_of_study, s.duration, s.created_at, s.startdate, s.enddate, s.gender, s.it_status, s.supervisor_id,
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

const updateStudentInformation = async (req, res) => {
  const { student_id } = req.params;
  const updates = req.body;

  try {
    if (!student_id) {
      return res.status(400).json({ 
        success: false,
        message: 'Student ID is required' 
      });
    }

    // Format incoming dates
    if (updates.startDate) {
      updates.startDate = new Date(updates.startDate).toISOString();
    }

    const updatedStudent = await updateStudentRecord(student_id, updates);

    return res.status(200).json({
      success: true,
      data: {
        id: updatedStudent.student_id,
        name: updatedStudent.name,
        email: updatedStudent.email,
        institution: updatedStudent.institution,
        level: updatedStudent.level,
        course_of_study: updatedStudent.course_of_study,
        startDate: updatedStudent.startDate,
        endDate: updatedStudent.endDate,
        supervisor_id: updatedStudent.supervisor_id
      }
    });

  } catch (error) {
    console.error('Update error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to update student record'
    });
  }
};

module.exports = { getAllStudents, getStudentDetails, updateStudentInformation };