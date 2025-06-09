const express = require('express');
const { loginUser } = require('../controllers/authController.js');
const router = express.Router()
;
router.post('/login', loginUser);

module.exports = router;