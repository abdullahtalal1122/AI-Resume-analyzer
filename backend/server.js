const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./database/database');
const analyzeResumeRoute = require('./routes/analyzeResume');
const authRoutes = require('./routes/auth');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', analyzeResumeRoute);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Smart Resume Analyzer API is running!' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
