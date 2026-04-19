import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['listing_created', 'listing_claimed', 'listing_saved', 'impact_updated'],
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  description: {
    type: String,
    required: true
  },
  module: {
    type: String,
    enum: ['Annapurna', 'Aushadh', 'Samagri'],
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Activity', activitySchema);