require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const auth = require('./controllers/authController');
const authRoutes = require('./routes/authRoutes');
const { authenticate } = require('./middleware/authMiddleware');


const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth/login', authRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the ECEWS API');
});
app.get('/api/protected', authenticate, (req, res) => {
    res.json({ message: 'Hello! This is a protected route, ${req.user.role} ${req.user.email}' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});