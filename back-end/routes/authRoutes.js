const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validateEmailDomain = require('../middleware/validateEmailDomain');
const { getUserByEmailInternal } = require('../models/userModel');

// Public
router.post('/register', register);

// First tries internal, then checks external if not found
router.post('/login', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Login request for:', email);
    
    const internalUser = await getUserByEmailInternal(email);

    if (internalUser) {
      return login(req, res);
    } else {
      validateEmailDomain(req, res, () => login(req, res));
    }
  } catch (err) {
    console.error('Error in /login route:', err);
    res.status(500).json({ message: 'Internal error' });
  }
});

module.exports = router;
