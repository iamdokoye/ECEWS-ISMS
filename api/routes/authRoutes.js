const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// Register a user
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

// Logout route
router.post('/logout', authController.logout);

router.get('/protected', verifyToken, (req, res) => {
  // Access the user info stored in JWT
  if (req.user && req.user.name) {
    res.status(200).json({ message: `Hello ${req.user.name}` });
  } else {
    res.status(401).json({ message: 'Unauthorized: User information not found.' });
  }
});

router.get('/profile', verifyToken, authController.getprofile);
router.get('/me', verifyToken, authController.getprofile);

router.get('/debug-token', verifyToken, (req, res) => {
  console.log('✅ Reached protected route. Decoded user:', req.user);
  res.json({
    message: 'Token decoded successfully',
    user: req.user
  });
});

// Export the router
module.exports = router;