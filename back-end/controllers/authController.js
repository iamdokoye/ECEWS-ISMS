const {
  getUserByEmailInternal,
  getUserByEmailExternal,
  createUserInternal,
} = require('../models/userModel');
const { addStudent } = require('../models/studentModel');


const register = async (req, res) => {
  const { name, email, password, role, unit, duration } = req.body;
  if (!name || !email || !password || !role || !unit)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    const existingUser = await getUserByEmailInternal(email);
    if (existingUser) return res.status(409).json({ message: 'User already exists' });
    
    // 1. Create user in internal database
    await createUserInternal({ name, email, password, role, unit });
    
    // 2. If the role is student, auto-add to students table
    if (role === 'student') {
      // Fetch the newly created user to get its ID
      const newUser = await getUserByEmailInternal(email);
      const hrUserId = req.user?.id || 1; // Replace 1 with real HR ID logic if available
      const validDurations = [3, 6, 9, 12];
      const chosenDuration = Number(duration) || 6;

      if (!validDurations.includes(chosenDuration)) {
        return res.status(400).json({ message: 'Invalid duration. Must be 3, 6, 9, or 12 months.' });
      }
      await addStudent({
        student_id: newUser.id,
        added_by_hr: hrUserId,
        duration: chosenDuration
      });
    }

    // 3. Return success response
    return res.status(201).json({ message: 'User registered successfully' });

  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const userInternal = await getUserByEmailInternal(email);
    if (userInternal) {
      if (userInternal.password === password) {
        return res.status(200).json({ message: 'Login successful (internal)', user: userInternal });
      } else {
        return res.status(401).json({ message: 'Invalid password' });
      }
    }

    // Now we're in external zone
    const userExternal = await getUserByEmailExternal(email);
    if (userExternal && userExternal.password === password) {
      return res.status(200).json({ message: 'Login successful (external)', user: userExternal });
    } else {
      return res.status(404).json({ message: 'User not found or password incorrect in external DB' });
    }
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports = {
  register,
  login,
};
