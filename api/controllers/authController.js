const {
  getUserByEmailInternal,
  getUserByEmailExternal,
  createUserInternal,
} = require('../models/userModel');
const { addStudent } = require('../models/studentModel');

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const { JWT_SECRET, JWT_EXPIRATION } = process.env;
const register = async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    unit,
    duration,
    institution,
    level,
    course_of_study,
    gender,
    interest,
    supervisor
  } = req.body;

  if (!name || !email || !password || !role || !unit) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  try {
    const existingUser = await getUserByEmailInternal(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Step 1: Create user in internal database
    await createUserInternal({ name, email, password, role, unit });

    // Step 2: If role is student, enrich in students table
    if (role === 'student') {
      // Ensure student-specific fields are present
      if (!institution || !level || !course_of_study || !gender || !supervisor) {
        return res.status(400).json({ message: 'Missing student-specific fields' });
      }

      const newUser = await getUserByEmailInternal(email);
      const validDurations = [3, 6, 9, 12];
      const chosenDuration = Number(duration) || 6;

      if (!validDurations.includes(chosenDuration)) {
        return res.status(400).json({
          message: 'Invalid duration. Must be 3, 6, 9, or 12 months.'
        });
      }

      await addStudent({
        student_id: newUser.id,
        supervisor_id: supervisor,
        duration: chosenDuration,
        name,
        institution,
        level,
        interest,
        course_of_study,
        gender
      });
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const userInternal = await getUserByEmailInternal(email);
    if (userInternal) {
      if (userInternal.password === password) {
        // Generate JWT token
        const token = jwt.sign(
          {
            id: userInternal.id,
            name: userInternal.name,
            email: userInternal.email,
            role: userInternal.role,
            unit: userInternal.unit
          },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRATION }
        );
        
        return res.status(200).json({
          message: 'Login successful!', token, 
          token: token,
          user: {
            id: userInternal.id,
            role: userInternal.role,
            name: userInternal.name, // Ensure this is included
            email: userInternal.email
          }
        });
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
const getprofile = (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  } else {
    return res.status(200).json({
      user: {
        token: req.token,
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        unit: req.user.unit
      }
    });
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

module.exports = {
  register,
  login,
  getprofile,
  logout
};
