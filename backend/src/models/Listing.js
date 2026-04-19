import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  module: {
    type: String,
    enum: ['Annapurna', 'Aushadh', 'Samagri'],
    required: true
  },
  category: {
    type: String,
    enum: ['Cooked Meals', 'Packaged', 'Raw Materials', 'Beverages', 'Snacks', 'Medicine', 'Books', 'Equipment'],
    default: 'Packaged'
  },
  location: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  timeLimit: {
    type: String
  },
  isUrgent: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Active', 'Claimed', 'Expired'],
    default: 'Active'
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  claimedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

export default mongoose.model('Listing', listingSchema);