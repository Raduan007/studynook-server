const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Protected routes
router.get('/my-bookings', verifyToken, getMyBookings);
router.post('/', verifyToken, createBooking);
router.put('/:id/cancel', verifyToken, cancelBooking);

module.exports = router;
