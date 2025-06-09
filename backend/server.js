require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/authRoutes.js");
const { errorHandler } = require("./middleware/errorHandler.js");

connectDB(); // Connect to MongoDB

const app = express();

// Middleware should be added after app is initialized
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use(errorHandler); // Error handling middleware

app.get("/", (req, res) => {
    res.json({ message: "API WORKING!!!" })
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));