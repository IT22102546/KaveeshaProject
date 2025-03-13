import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    address: { type: String, required: true },

    studioId: { type: mongoose.Schema.Types.ObjectId, ref: "Studio", required: true },
    studioTitle: { type: String, required: true },
    services: { type: [String], default: [] },
    timeSlot: { type: String, required: true }, // Time slot (e.g., "10:00 - 11:00")
    bookingDate: { type: Date, required: true }, // Date of the booking
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
export default Booking;