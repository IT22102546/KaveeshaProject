// models/Activity.js
import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['present', 'past', 'future'],
    default: 'present',
  },
  mainImage: {
    type: String,
    required: true, // Keep this for the single main image
  },
}, { timestamps: true });

const Activity = mongoose.model('Activity', ActivitySchema);

export default Activity;
