const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const supervisorRoutes = require('./routes/assignSupervisorRoutes')
const studentRoutes = require('./routes/studentUnitRoutes')
const studentViewRoutes = require('./routes/studentViewRoutes')
const logsRoutes = require('./routes/logsRoutes');

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
app.use('/students', studentViewRoutes)
app.use('/logs', logsRoutes);


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
