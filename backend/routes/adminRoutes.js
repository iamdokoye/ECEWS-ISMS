const express = require('express');
const { getDashboardStats } = require('../controllers/adminController.js');
const router = express.Router();

router.get('/dashboard', getDashboardStats);
module.exports = router;