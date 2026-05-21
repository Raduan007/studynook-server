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
router.get('/latest', getLatestRooms);

// Protected named routes — must be declared before /:id to avoid being matched as an ID
router.get('/my-rooms', verifyToken, getMyRooms);

// Public dynamic routes
router.get('/:id', getSingleRoom);

// Protected dynamic routes
router.post('/', verifyToken, createRoom);
router.put('/:id', verifyToken, updateRoom);
router.delete('/:id', verifyToken, deleteRoom);

module.exports = router;
