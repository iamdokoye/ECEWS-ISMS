const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const validateEmailDomain = require('../middleware/validateEmailDomain');

router.post('/register', register);

router.post('/login', async (req, res) => {
  const { email } = req.body;
  const internalUser = await require('../models/userModel').getUserByEmailInternal(email);
  if (internalUser) {
    return require('../controllers/authController').login(req, res);
  } else {
    // No timeout needed anymore
    validateEmailDomain(req, res, () => require('../controllers/authController').login(req, res));
  }
});

module.exports = router;
