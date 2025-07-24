const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');
const { protect } = require('../middleware/authMiddleware');

// GET /listings?search=...&filter=...&landlord=...
router.get('/', listingController.getAllListings);
router.post('/', protect, listingController.createListing);
router.get('/:id', listingController.getListingById);
router.put('/:id', protect, listingController.updateListing);
router.delete('/:id', protect, listingController.deleteListing);

module.exports = router;
