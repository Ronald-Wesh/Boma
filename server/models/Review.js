const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  safety: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  water: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  landlordReliability: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
