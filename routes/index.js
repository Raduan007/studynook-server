const express = require('express');
const router = express.Router();
const { getHealthCheck } = require('../controllers');
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes');
const bookingRoutes = require('./bookingRoutes');

// Basic API route
router.get('/health', getHealthCheck);

// Authentication routes
router.use('/auth', authRoutes);

// Room routes
router.use('/rooms', roomRoutes);

// Booking routes
router.use('/bookings', bookingRoutes);

module.exports = router;
