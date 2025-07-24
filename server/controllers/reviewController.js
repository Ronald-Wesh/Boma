const Review = require('../models/Review');

// Get all reviews for a listing
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ listing: req.params.listingId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new review for a listing (one per user per listing)
exports.createReview = async (req, res) => {
  try {
    const existing = await Review.findOne({ listing: req.params.listingId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'You have already reviewed this listing' });
    }
    const review = new Review({
      listing: req.params.listingId,
      safety: req.body.safety,
      water: req.body.water,
      landlordReliability: req.body.landlordReliability,
      user: req.user._id
    });
    const saved = await review.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a review (by owner or admin)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user && review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await review.deleteOne();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
