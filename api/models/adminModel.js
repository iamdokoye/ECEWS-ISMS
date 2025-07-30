const internalDb = require('../config/database');

const addAdmin = async ({ user_id, access_level }) => {
  const result = await internalDb.query(
    `
    INSERT INTO admins (user_id, access_level)
    VALUES ($1, $2)
    RETURNING *
    `,
    [user_id, access_level]
  );
  return result.rows[0];
};

module.exports = {
  addAdmin,
};
