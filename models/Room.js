const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Room title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Room description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Room price is required'],
  },
  capacity: {
    type: Number,
    default: 1,
  },
  owner: {
    type: String, // Stored as a string to match our mocked req.user.id setup
    required: [true, 'Room owner is required'],
  },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
