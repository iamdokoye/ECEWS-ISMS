const pool = require('../config/database.js');

const getDashboardStats = async (req, res) => {
    try {
        const studentResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['student']);
        const totalStudents = parseInt(studentResult.rows[0].count, 10);

        const supervisorResult = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', ['supervisor']);
        const supervisorCount = parseInt(supervisorResult.rows[0].count, 10);

        const unitCountResult = await pool.query("SELECT COUNT(DISTINCT unit) FROM users WHERE role = 'student'");
        const unitCount = parseInt(unitCountResult.rows[0].count, 10);

        const unitListResult = await pool.query(`
            SELECT unit, COUNT(*) as count
            FROM users
            WHERE role = 'student'
            GROUP BY unit
        `);
        const units = unitListResult.rows.map(row => ({
            name: row.unit,
            count: parseInt(row.count, 10)
        }));

        const maleResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'male'");
        const femaleResult = await pool.query("SELECT COUNT(*) FROM students WHERE gender = 'female'");

        const activeResult = await pool.query("SELECT COUNT(*) FROM students WHERE it_status = 'active'");
        const pastResult = await pool.query("SELECT COUNT(*) FROM students WHERE it_status = 'past'");

        const studentListResult = await pool.query(`
            SELECT u.name, u.unit, s.interest 
            FROM users u JOIN students s 
            ON u.id = s.student_id 
            WHERE u.role = 'student'
            LIMIT 7
        `);

        const supervisorListResult = await pool.query(`
            SELECT name, unit
            FROM users
            WHERE role = 'supervisor'
            LIMIT 6
        `);

        res.json({
            totalStudents,
            supervisorCount,
            unitCount,
            units,
            gender: {
                male: parseInt(maleResult.rows[0].count, 10),
                female: parseInt(femaleResult.rows[0].count, 10)
            },
            status: {
                active: parseInt(activeResult.rows[0].count, 10),
                past: parseInt(pastResult.rows[0].count, 10)
            },
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
