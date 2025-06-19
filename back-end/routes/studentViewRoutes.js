const express = require('express');
const router = express.Router();
const { getAllStudents, getStudentDetails } = require('../controllers/studentViewController');

router.get('/all', getAllStudents);
router.get('/:id', getStudentDetails);

module.exports = router;