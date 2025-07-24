const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Uncomment when middleware is ready

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get user profile (protected)
router.get('/profile', protect, authController.getUserProfile);

// Update user profile (protected)
router.put('/profile', protect, authController.updateUserProfile);

module.exports = router; 