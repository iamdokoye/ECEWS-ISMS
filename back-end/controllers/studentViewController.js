const pool = require('../db/internalDB');

const getAllStudents = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                u.name, u.email, u.unit,
                s.course_of_study, s.level, s.duration, s.institution, s.level, s.interest, s.it_status, s.created_at
            FROM users u
            JOIN students s ON s.student_id = u.id
            ORDER BY s.created_at DESC
        `);

        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Error fetching all students:', err);
        res.status(500).json({ message: 'Failed to fetch students' });
    }
};

const getStudentDetails = async (req, res) => {
    const { id } = req.params;
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

module.exports = { getAllStudents, getStudentDetails};