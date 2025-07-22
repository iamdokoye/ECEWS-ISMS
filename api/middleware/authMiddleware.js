const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];;

  if (!token) {
    console.log('❌ No token found in cookies');
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log('❌ Invalid token:', err.message);
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    console.log('✅ Token decoded successfully:', decoded);
    req.user = decoded; // Attach decoded info to request
    next();
  });
};

const checkSupervisorRole = (req, res, next) => {
    if (req.user.role !== 'supervisor') {
        return res.status(403).json({ 
            message: 'Access denied. Supervisor role required' 
        });
    }
    next();
};

module.exports = verifyToken, checkSupervisorRole;
