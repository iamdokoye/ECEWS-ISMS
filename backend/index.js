const express = require('express');
const app = express();
const authRoutes = require('./routes/auth.js');
const cors = require('cors');
require('dotenv').config();


// Import database connection
const db = require('./db');

// Middleware to enable CORS
app.use(cors());

// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// Set the port from environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());
app.use('/', authRoutes);

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, World!');
}
);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
