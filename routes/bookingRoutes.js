const express = require('express');
const router = express.Router();
const { createBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Protected route to create booking
router.post('/', verifyToken, createBooking);

module.exports = router;
