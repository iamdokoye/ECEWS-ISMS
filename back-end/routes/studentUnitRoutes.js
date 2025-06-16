const express = require('express');
const router = express.Router();
const {
  getUnits,
  getSupervisorByUnit
} = require('../controllers/studentUnitController');

router.get('/units', getUnits);
router.get('/supervisor/:unit', getSupervisorByUnit);

module.exports = router;