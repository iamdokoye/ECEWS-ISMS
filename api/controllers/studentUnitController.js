const pool = require('../config/database');

const getUnits = async (req, res) => {
  try {
    const result = await pool.query('SELECT DISTINCT unit FROM users WHERE unit IS NOT NULL');
    const units = result.rows.map(row => row.unit);
    res.status(200).json(units);
  } catch (err) {
    console.error('Error fetching units:', err);
    res.status(500).json({ message: 'Failed to fetch units' });
  }
};

const getSupervisorByUnit = async (req, res) => {
  const { unit } = req.params;
  try {
    const result = await pool.query('SELECT name, id FROM users WHERE unit = $1 AND role = $2 LIMIT 1', [unit, 'supervisor']);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No supervisor found for this unit' });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching supervisor:', err);
    res.status(500).json({ message: 'Failed to fetch supervisor' });
  }
};

module.exports = {
  getUnits,
  getSupervisorByUnit
};
