const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect,admin } = require('../middleware/authMiddleware');

// Get all listings
router.get('/', listingController.getAllListings);

// Get single listing by ID
router.get('/:id', listingController.getListingById);

// Create new listing (protected)
router.post('/', protect,admin,listingController.createListing);

// Update listing (protected)
router.put('/:id', protect,admin, listingController.updateListing);

// Delete listing (protected)
router.delete('/:id', protect,admin, listingController.deleteListing);

module.exports = router;
