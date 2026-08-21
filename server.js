// Root entry point for IIS iisnode on SmarterASP.net
// Serves static frontend files and delegates API requests

const express = require('express');
const path = require('path');
const cors = require('cors');

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'production',
    db_host: process.env.DB_HOST || 'not configured',
    timestamp: new Date().toISOString()
  });
});

// Serve static frontend build files (Root or frontend/dist fallback)
const rootIndexPath = path.join(__dirname, 'index.html');
const distIndexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');

if (require('fs').existsSync(path.join(__dirname, 'assets'))) {
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
}
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// SPA fallback routing
app.get('*', (req, res) => {
  if (require('fs').existsSync(rootIndexPath)) {
    res.sendFile(rootIndexPath);
  } else {
    res.sendFile(distIndexPath);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 AVADH server running on port ${PORT}`);
});
