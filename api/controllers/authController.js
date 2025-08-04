const {
  getUserByEmailInternal: getUserByEmail,
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
    startDate,
    endDate,
    interest,
    supervisor
  } = req.body;

  if (!name || !email || !password || !role || !unit) {
    return res.status(400).json({ message: 'All required fields must be filled' });
  }

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Step 1: Create user in internal database
    await createUserInternal({ name, email, password, role, unit });

    // Step 2: If role is student, enrich in students table
    if (role === 'student') {
      // Ensure student-specific fields are present
      if (!institution || !level || !course_of_study || !gender || !supervisor || !startDate || !endDate) {
        return res.status(400).json({ message: 'Missing student-specific fields' });
      }

      const newUser = await getUserByEmail(email);
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
        gender,
        startDate,
        endDate
      });
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const updateStudent = async (student_id, updateFields) => {
  // Filter out empty or undefined fields
  const validUpdates = Object.entries(updateFields).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {});

  // If no valid fields to update, return early
  if (Object.keys(validUpdates).length === 0) {
    return { message: 'No valid fields to update' };
  }

  // Generate the SET clause dynamically
  const setClause = Object.keys(validUpdates)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ');

  // Generate the values array
  const values = Object.values(validUpdates);
  values.push(student_id); // Add student_id as the last parameter

  // Calculate endDate if duration or startDate is being updated
  if (validUpdates.duration || validUpdates.startDate) {
    // Get current student data to calculate new endDate
    const student = await pool.query(
      'SELECT startDate, duration FROM students WHERE student_id = $1',
      [student_id]
    );

    const currentStartDate = validUpdates.startDate || student.rows[0].startdate;
    const currentDuration = validUpdates.duration || student.rows[0].duration;

    if (currentStartDate && currentDuration) {
      const start = new Date(currentStartDate);
      start.setMonth(start.getMonth() + Number(currentDuration));
      const endDate = start.toISOString().split('T')[0];
      setClause += `, endDate = $${values.length + 1}`;
      values.push(endDate);
    }
  }

  const query = `
    UPDATE students
    SET ${setClause}
    WHERE student_id = $${values.length}
    RETURNING *
  `;

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Get student by ID with all fields
const getStudentById = async (student_id) => {
  const result = await pool.query(
    `SELECT 
      s.*,
      u.email AS student_email,
      sup.name AS supervisor_name
     FROM students s
     JOIN users u ON s.student_id = u.id
     LEFT JOIN users sup ON s.supervisor_id = sup.id
     WHERE s.student_id = $1`,
    [student_id]
  );
  return result.rows[0];
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const userInternal = await getUserByEmail(email);

    if (!userInternal) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userInternal.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    console.log('Generating token for user:', userInternal);
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
    console.log('Token generated:', token);
    return res.status(200).json({
      message: 'Login successful!',
      token,
      user: {
        id: userInternal.id,
        role: userInternal.role,
        name: userInternal.name,
        email: userInternal.email
      }
    });

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
  logout,
  updateStudent,
  getStudentById
};
