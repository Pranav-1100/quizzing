const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);

// Database initialization
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync();
    console.log('Database synchronized and tables created');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

initDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;