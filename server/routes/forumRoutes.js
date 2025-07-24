const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Get all forum posts for a listing
router.get('/:listingId', forumController.getPosts);

// Create a new forum post (protected)
router.post('/:listingId', protect, forumController.createPost);

// Delete a forum post (protected)
router.delete('/:postId', protect, forumController.deletePost);

module.exports = router; 