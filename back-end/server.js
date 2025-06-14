require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


const app = express();

app.use(cors({}
));

app.use(express.json());

app.use('/auth', authRoutes);

app.get('/api/test', (req, res) => {
    res.send('Welcome to the ECEWS API');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

