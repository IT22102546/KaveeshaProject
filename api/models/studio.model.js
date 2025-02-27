import mongoose from 'mongoose';

const studioSchema = new mongoose.Schema(
  {
   
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    mainImage: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
      default: [],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Studio = mongoose.model('Studio', studioSchema);

export default Studio;
