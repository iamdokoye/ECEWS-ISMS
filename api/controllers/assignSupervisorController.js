// controllers/assignSupervisorController.js

const internalPool = require('../db/database');

// 1. Fetch distinct unit names from internal DB (supervisors table)
const getUnits = async (req, res) => {
  try {
    const result = await internalPool.query('SELECT DISTINCT unit FROM supervisors WHERE unit IS NOT NULL');
    const units = result.rows.map(row => row.unit);
    res.status(200).json(units);
  } catch (err) {
    console.error('Error fetching units from internal DB:', err);
    res.status(500).json({ message: 'Failed to fetch units' });
  }
};

// 2. Fetch users in a unit from internal DB (supervisors table)
const getUsersByUnit = async (req, res) => {
  const { unit } = req.params;
  try {
    const result = await internalPool.query('SELECT supervisor_id, first_name, last_name FROM supervisors WHERE unit = $1', [unit]);
    const users = result.rows.map(user => ({
      id: user.supervisor_id,
      name: `${user.first_name} ${user.last_name}`
    }));
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users by unit from internal DB:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// 3. Assign supervisor from internal DB to users table in internal DB
const assignSupervisor = async (req, res) => {
  const { supervisorId, unit } = req.body;

  if (!supervisorId || !unit) {
    return res.status(400).json({ message: 'Supervisor ID and unit are required' });
  }

  try {
    // Fetch from internal DB (supervisors table)
    const intUser = await internalPool.query(
      'SELECT first_name, last_name, email, password FROM supervisors WHERE supervisor_id = $1',
      [supervisorId]
    );
    if (intUser.rows.length === 0) {
      return res.status(404).json({ message: 'Supervisor not found in internal DB' });
    }

    const { first_name, last_name, email, password } = intUser.rows[0];
    const fullName = `${first_name} ${last_name}`;

    // Insert into users table with forced role = supervisor
    await internalPool.query(
      'INSERT INTO users (name, email, password, role, unit) VALUES ($1, $2, $3, $4, $5)',
      [fullName, email, password, 'supervisor', unit]
    );

    res.status(201).json({ message: 'Supervisor assigned successfully' });
  } catch (err) {
    console.error('Error assigning supervisor:', err);
    res.status(500).json({ message: 'Failed to assign supervisor' });
  }
};

module.exports = {
  getUnits,
  getUsersByUnit,
  assignSupervisor
};
