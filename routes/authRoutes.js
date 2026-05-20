const express = require('express');
const router = express.Router();
const { login, logout, getProfile } = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authMiddleware');

// Public routes
router.post('/login', login);
router.post('/logout', logout);

// Protected routes (must pass verifyToken middleware)
router.get('/profile', verifyToken, getProfile);

module.exports = router;
