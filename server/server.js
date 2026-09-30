const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

process.env.MONGOMS_VERSION = process.env.MONGOMS_VERSION || '7.0.3';

const app = express();

// Connect Database & Auto-Seed
connectDB();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Static uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/facilities', require('./routes/facilityRoutes'));
app.use('/api/standards', require('./routes/standardRoutes'));
app.use('/api/inspections', require('./routes/inspectionRoutes'));
app.use('/api/violations', require('./routes/violationRoutes'));
app.use('/api/corrective-actions', require('./routes/actionRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Root API Healthcheck endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'Swachhta & Green Standard Compliance Monitoring Dashboard API',
    status: 'Active',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

// Serve Frontend Static Production Bundle
const clientBuildPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[Production Deployment] Swachhta Compliance Application running live on http://localhost:${PORT}`);
});
