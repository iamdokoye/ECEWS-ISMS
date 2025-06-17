// controllers/assignSupervisorController.js

const internalPool = require('../db/internalDB');
const externalPool = require('../db/externalDB');

// 1. Fetch distinct unit names from external DB
const getUnitsFromExternal = async (req, res) => {
  try {
    const result = await externalPool.query('SELECT DISTINCT position FROM staff_ancillary WHERE position IS NOT NULL');
    const units = result.rows.map(row => row.position);
    res.status(200).json(units);
  } catch (err) {
    console.error('Error fetching units from external DB:', err);
    res.status(500).json({ message: 'Failed to fetch units' });
  }
};

// 2. Fetch users in a unit from external DB
const getUsersByUnitExternal = async (req, res) => {
  const { unit } = req.params;
  try {
    const result = await externalPool.query('SELECT staff_id, first_name, last_name FROM staff_ancillary WHERE position = $1', [unit]);
    const users = result.rows.map(user => ({
      id: user.staff_id,
      name: `${user.first_name} ${user.last_name}`
    }));
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users by unit from external DB:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// 3. Assign supervisor from external DB to internal DB
const assignSupervisor = async (req, res) => {
  const { supervisorId, unit } = req.body;

  if (!supervisorId || !unit) {
    return res.status(400).json({ message: 'Supervisor ID and unit are required' });
  }

  try {
    // Fetch from external DB
    const extUser = await externalPool.query('SELECT first_name, last_name, email, password FROM staff_ancillary WHERE staff_id = $1', [supervisorId]);
    if (extUser.rows.length === 0) {
      return res.status(404).json({ message: 'User not found in external DB' });
    }

    const { first_name, last_name, email, password } = extUser.rows[0];
    const fullName = `${first_name} ${last_name}`;

    // Insert into internal DB with forced role = supervisor
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
  getUnitsFromExternal,
  getUsersByUnitExternal,
  assignSupervisor
};
