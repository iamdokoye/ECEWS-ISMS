// routes/public.js
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.get('/generate-public-token', (req, res) => {
  const token = jwt.sign(
    {
      role: 'public',
      access: 'read-only',
      origin: 'website',
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // shorter expiry = more secure
  );

  res.json({ token });
});

module.exports = router;
