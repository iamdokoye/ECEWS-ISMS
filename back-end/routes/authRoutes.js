const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');
const { getUserByEmailInternal } = require('../models/userModel');

// Register route stays the same
router.post('/register', require('../controllers/authController').register);

// Login route
router.post('/login', async (req, res) => {
  const { email } = req.body;

  try {
    const internalUser = await getUserByEmailInternal(email);

    if (internalUser) {
      // If found in internal DB (regardless of email), continue login
      return require('../controllers/authController').login(req, res);
    }

    // Not found in internal DB
    if (email.endsWith('@ecews.org')) {
      // Only check external DB if email is @ecews.org
      return require('../controllers/authController').login(req, res);
    }

    // Not in internal DB, and not an @ecews.org email
    return res.status(404).json({ message: 'User not found in internal DB' });

  } catch (error) {
    console.error('Login route error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
