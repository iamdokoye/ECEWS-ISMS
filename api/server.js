const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes')
const studentRoutes = require('./routes/studentRoutes');
const logsRoutes = require('./routes/logsRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(cors(
  {
    origin: 'http://127.0.0.1:5500',
    credentials: true,
  }
));

app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/supervisor', supervisorRoutes)
app.use('/students', studentRoutes)
app.use('/students', studentRoutes)
app.use('/logs', logsRoutes);
app.use('/images', uploadRoutes);
app.use('/public', require('./routes/public'));



app.get('/', (res) => res.send('Server OK'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});
