import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String },
    email: { type: String },
    mobile: { type: String },
    address: { type: String },

    studioId: { type: mongoose.Schema.Types.ObjectId, ref: "Studio" },
    studioTitle: { type: String },
    price: { type: Number },
    services: { type: [String], default: [] },
    bookingDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;
