// src/models/Bearer.js
import mongoose from 'mongoose';

const bearerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  details: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Bearer = mongoose.model('Bearer', bearerSchema);
export default Bearer;
