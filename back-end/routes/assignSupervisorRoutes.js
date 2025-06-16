const express = require('express');
const router = express.Router();
const {
  getUnitsFromExternal,
  getUsersByUnitExternal,
  assignSupervisor
} = require('../controllers/assignSupervisorController');

// GET /api/units - fetch units from external DB
router.get('/units', getUnitsFromExternal);

// GET /api/users/by-unit/:unit - fetch users from external DB by unit
router.get('/users/by-unit/:unit', getUsersByUnitExternal);

// POST /api/assign-supervisor - assign supervisor into internal DB
router.post('/assign-supervisor', assignSupervisor);

module.exports = router;
