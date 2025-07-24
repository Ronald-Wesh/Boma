const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/all', protect, admin, forumController.getAllForums); // admin only
router.get('/:listingId', forumController.getPosts);
router.post('/:listingId', protect, forumController.createPost);
router.delete('/:postId', protect, forumController.deletePost);

module.exports = router; 