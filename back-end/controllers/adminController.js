const Student = require('../models/studentModel');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
    try {
        // Get total number of students
        const studentResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['student']);
        const totalStudents = parseInt(studentResult.rows[0].count, 10);

        // Get total number of Supervisors
        const supervisorResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['supervisor']);
        const totalSupervisors = parseInt(supervisorResult.rows[0].count);

        // Get total number of Units
        const unitResult = await pool.query('SELECT COUNT(DISTINCT unit) FROM students');
        const totalUnits = parseInt(unitResult.rows[0].count);

        // Get gender distribution
        const maleResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'male'");
        const femaleResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'female'");
        const otherResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'other'");

        // Get IT Status
        const activeResult = await pool.query('SELECT COUNT(*) FROM students WHERE status = $1', ['active']);
        const pastResult = await pool.query('SELECT COUNT(*) FROM students WHERE status = $1', ['past']);

        res.json({
            totalStudents,
            totalSupervisors,
            totalUnits,
            gender: {
                maleResult: parseInt(maleResult.rows[0].count),
                femaleResult: parseInt(femaleResult.rows[0].count),
                otherResult: parseInt(otherResult.rows[0].count)
            },
            status: {
                activeResult: parseInt(activeResult.rows[0].count),
                pastResult: parseInt(pastResult.rows[0].count)
            }
        });
    }
    catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};