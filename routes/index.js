const express = require('express');
const router = express.Router();
const { getHealthCheck } = require('../controllers');
const authRoutes = require('./authRoutes');

// Basic API route
router.get('/health', getHealthCheck);

// Authentication routes
router.use('/auth', authRoutes);

module.exports = router;
