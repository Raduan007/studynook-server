const express = require('express');
const router = express.Router();
const {
  createRoom,
  getAllRooms,
  getLatestRooms,
  getSingleRoom,
  updateRoom,
  deleteRoom,
  getMyRooms,
} = require('../controllers/roomController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes
router.get('/', getAllRooms);
router.get('/latest', getLatestRooms); // Declared before /:id to prevent it from matching as an ID parameter
router.get('/:id', getSingleRoom);

// Protected routes (Require JWT token AND controller validates owner match)
router.get('/my-rooms', verifyToken, getMyRooms);
router.post('/', verifyToken, createRoom);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

module.exports = router;
