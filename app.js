require('dotenv').config();
const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const analyticsRoutes = require('./routes/analytics');
const questionRoutes = require('./routes/questions');
const noteRoutes = require('./routes/notes');
const studyPlanRoutes = require('./routes/studyPlan');
const quizRoutes = require('./routes/quiz');
const studyGroupRoutes = require('./routes/studyGroup');

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/study-plan', studyPlanRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/study-group', studyGroupRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Database initialization
const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized and tables created/updated');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    console.error('Detailed error:', error.parent);
    process.exit(1);
  }
};

// Start server function
const startServer = async () => {
  await initDatabase();
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;