
const pool = require('../db');

const getDashboardStats = async (req, res) => {
    try {
        const studentResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['student']);
        const totalStudents = parseInt(studentResult.rows[0].count, 10);

        const supervisorResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['supervisor']);
        const supervisorCount = parseInt(supervisorResult.rows[0].count, 10);

        const unitResult = await pool.query('SELECT COUNT(DISTINCT unit) FROM students');
        const unitCount = parseInt(unitResult.rows[0].count, 10);

        const maleResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'male'");
        const femaleResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'female'");

        const activeResult = await pool.query("SELECT COUNT(*) FROM students WHERE status = 'active'");
        const pastResult = await pool.query("SELECT COUNT(*) FROM students WHERE status = 'past'");

        const studentListResult = await pool.query("SELECT full_name AS name, unit, gender FROM students LIMIT 6");
        const supervisorListResult = await pool.query("SELECT full_name AS name, unit FROM users WHERE role = 'supervisor' LIMIT 6");

        res.json({
            totalStudents,
            supervisorCount,
            unitCount,
            male: parseInt(maleResult.rows[0].count, 10),
            female: parseInt(femaleResult.rows[0].count, 10),
            activeStudents: parseInt(activeResult.rows[0].count, 10),
            pastStudents: parseInt(pastResult.rows[0].count, 10),
            students: studentListResult.rows,
            supervisors: supervisorListResult.rows
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    getDashboardStats
};
