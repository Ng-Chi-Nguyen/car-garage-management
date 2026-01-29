const express = require('express');
const router = express.Router();

// Health check route
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API version route
router.get('/api/version', (req, res) => {
  res.json({
    success: true,
    version: '1.0.0',
    api: 'Garage Management API',
  });
});

module.exports = router;
