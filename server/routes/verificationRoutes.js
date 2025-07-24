const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/pending', protect, admin, verificationController.getPendingVerifications);
router.post('/:id/approve', protect, admin, verificationController.approveVerification);
router.post('/:id/reject', protect, admin, verificationController.rejectVerification);

module.exports = router;