const express = require('express');
const router = express.Router();
const { getHealthCheck } = require('../controllers');

// Basic API route
router.get('/health', getHealthCheck);

module.exports = router;
