const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { room, bookingDate, startTime, endTime } = req.body;

    if (!room || !bookingDate || !startTime || !endTime) {
      return res.status(400).json({ message: 'Please provide room, bookingDate, startTime, and endTime' });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      return res.status(400).json({ message: 'Start time must be before end time' });
    }

    // 1. Check if room exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // 2. Conflict Detection: Prevent overlapping bookings
    // A booking conflicts if it shares any time block with the requested start and end times.
    const overlappingBooking = await Booking.findOne({
      room: room,
      status: { $ne: 'cancelled' },
      $or: [
        // Existing booking starts during the new booking
        { startTime: { $gte: start, $lt: end } },
        // Existing booking ends during the new booking
        { endTime: { $gt: start, $lte: end } },
        // Existing booking completely encompasses the new booking
        { startTime: { $lte: start }, endTime: { $gte: end } }
      ]
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Room is already booked for this time slot' });
    }

    // 3. Create the booking
    const newBooking = new Booking({
      room,
      user: req.user.id,
      bookingDate: new Date(bookingDate),
      startTime: start,
      endTime: end,
      status: 'confirmed'
    });

    const savedBooking = await newBooking.save();

    // 4. Increment room booking count and use $push to add active booking
    await Room.findByIdAndUpdate(room, {
      $inc: { bookingCount: 1 },
      $push: { activeBookings: savedBooking._id }
    });

    res.status(201).json({
      message: 'Booking successful',
      booking: savedBooking
    });

  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('room', 'title price')
      .sort({ bookingDate: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your bookings', error: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify ownership
    if (booking.user !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Update booking status
    booking.status = 'cancelled';
    await booking.save();

    // Use $pull to remove booking from the room's activeBookings array
    await Room.findByIdAndUpdate(booking.room, {
      $pull: { activeBookings: booking._id }
    });

    res.status(200).json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  cancelBooking
};
