const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Get all reviews for a listing
router.get('/:listingId', reviewController.getReviews);

// Create a new review (protected)
router.post('/:listingId', protect, reviewController.createReview);

// Delete a review (protected)
router.delete('/:reviewId', protect, reviewController.deleteReview);

module.exports = router; 