const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const { getStudentsForSupervisor } = require('../controllers/supervisorController');
const {
  getUnits,
  getUsersByUnit,
  assignSupervisor
} = require('../controllers/assignSupervisorController');

// GET /api/units - fetch units from external DB
router.get('/units', getUnits);

// GET /api/users/by-unit/:unit - fetch users from external DB by unit
router.get('/users/by-unit/:unit', getUsersByUnit);

// POST /api/assign-supervisor - assign supervisor into internal DB
router.post('/assign', assignSupervisor);

router.get('/my-students', verifyToken, getStudentsForSupervisor);


module.exports = router;
