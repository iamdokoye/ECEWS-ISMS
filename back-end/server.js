  const express = require('express');
  const cors = require('cors');
  require('dotenv').config();

  const authRoutes = require('./routes/authRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const supervisorRoutes = require('./routes/assignSupervisorRoutes')

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/auth', authRoutes);
  app.use('/admin', adminRoutes);
  app.use('/assign', supervisorRoutes)

  app.get('/', (req, res) => res.send('Server OK'));

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
