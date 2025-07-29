const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  getUnits,
  getSupervisorByUnit
} = require('../controllers/studentUnitController');

//units
router.get('/units', getUnits);
router.get('/supervisor/:unit', getSupervisorByUnit);

//student routes
router.get('/all', studentController.getAllStudents);
router.get('/:id', studentController.getStudentDetails);
router.put('/:student_id', studentController.updateStudentInformation);

module.exports = router;