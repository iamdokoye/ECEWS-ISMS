const internalDb = require('../db/database');

const addSupervisor = async ({ user_id, specialization, office, phone_number }) => {
  const result = await internalDb.query(
    `
    INSERT INTO supervisors (user_id, specialization, office, phone_number)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [user_id, specialization, office, phone_number]
  );
  return result.rows[0];
};

const getAllSupervisors = async () => {
  const result = await internalDb.query(`
    SELECT sup.*, u.name, u.email, u.unit
    FROM supervisors sup
    JOIN users u ON sup.user_id = u.id
    ORDER BY u.name
  `);
  return result.rows;
};

module.exports = {
  addSupervisor,
  getAllSupervisors,
};
