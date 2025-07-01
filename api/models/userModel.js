const internalDb = require('../db/internalDB');
const externalDb = require('../db/externalDB');

const getUserByEmailInternal = async (email) => {
  const res = await internalDb.query('SELECT * FROM users WHERE email = $1', [email]);
  return res.rows[0];
};

const getUserByEmailExternal = async (email) => {
  const res = await externalDb.query('SELECT * FROM staff_ancillary WHERE email = $1', [email]);
  return res.rows[0];
};

const createUserInternal = async ({ name, email, password, role, unit }) => {
  await internalDb.query(
    'INSERT INTO users (name, email, password, role, unit) VALUES ($1, $2, $3, $4, $5)',
    [name, email, password, role, unit]
  );
};

module.exports = {
  getUserByEmailInternal,
  getUserByEmailExternal,
  createUserInternal,
};
