const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validateEmailDomain = require('../middleware/validateEmailDomain');

// Public
router.post('/register', register);

// First tries internal, then checks external if not found
router.post('/login', async (req, res, next) => {
  const { email } = req.body;
  const internalUser = await require('../models/userModel').getUserByEmailInternal(email);
  if (internalUser) {
    return require('../controllers/authController').login(req, res);
  } else {
    // Apply domain check before fallback
    validateEmailDomain(req, res, () => require('../controllers/authController').login(req, res));
  }
});

module.exports = router;
