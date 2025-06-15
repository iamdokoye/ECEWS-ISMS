// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');
const validateEmailDomain = require('../middleware/validateEmailDomain');
const { getUserByEmailInternal } = require('../models/userModel');

// Registration - public
router.post('/register', register);

// Login - smart handling of internal & external users
router.post('/login', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const internalUser = await getUserByEmailInternal(email);
    if (internalUser) {
      // Found in internal DB → skip domain check
      return login(req, res);
    } else {
      // Enforce @ecews.org domain for external login
      validateEmailDomain(req, res, () => login(req, res));
    }
  } catch (err) {
    console.error('Login route error:', err);
    return res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
