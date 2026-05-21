const mongoose = require('mongoose');
const Room = require('../models/Room');

// @desc    Create a new room
// @route   POST /api/rooms
// @access  Private
const createRoom = async (req, res) => {
  try {
    const { name, title, description, price, hourlyRate, capacity, floor, image, amenities } = req.body;

    // Support both frontend field names and schema field names
    const roomTitle = name || title;
    const roomPrice = hourlyRate || price;

    if (!roomTitle || !description || !roomPrice) {
      return res.status(400).json({ message: 'Room name, description, and hourly rate are required.' });
    }

    const newRoom = new Room({
      title: roomTitle,
      description,
      price: Number(roomPrice),
      capacity: Number(capacity) || 1,
      floor: Number(floor) || 0,
      image: image || '',
      amenities: amenities || [],
      owner: req.user.id,
    });

    const savedRoom = await newRoom.save();
    res.status(201).json(savedRoom);
  } catch (error) {
    res.status(400).json({ message: 'Error creating room', error: error.message });
  }
};

// @desc    Get all rooms (with optional search and filters)
// @route   GET /api/rooms
// @access  Public
const getAllRooms = async (req, res) => {
  try {
    const { search, amenities, floor, minRate, maxRate } = req.query;
    let query = {};

    // Search by room name
    if (search) query.title = { $regex: search, $options: 'i' };

    // Filter by amenities ($in)
    if (amenities) {
      const amenitiesArr = amenities.split(',').map(a => a.trim());
      query.amenities = { $in: amenitiesArr };
    }

    // Optional floor filter
    if (floor) query.floor = Number(floor);

    // Optional rate (price) filter
    if (minRate || maxRate) {
      query.price = {};
      if (minRate) query.price.$gte = Number(minRate);
      if (maxRate) query.price.$lte = Number(maxRate);
    }

    const rooms = await Room.find(query).sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
};

// @desc    Get latest 6 rooms
// @route   GET /api/rooms/latest
// @access  Public
const getLatestRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 }).limit(6);
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching latest rooms', error: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
const getSingleRoom = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private
const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Owner verification
    if (room.owner !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to update this room' });
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(400).json({ message: 'Error updating room', error: error.message });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private
const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Owner verification
    if (room.owner !== req.user.id) {
      return res.status(403).json({ message: 'User not authorized to delete this room' });
    }

    await Room.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
};

// @desc    Get rooms created by logged in user
// @route   GET /api/rooms/my-rooms
// @access  Private
const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching your rooms', error: error.message });
  }
};

module.exports = {
  createRoom,
  getAllRooms,
  getLatestRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
};
