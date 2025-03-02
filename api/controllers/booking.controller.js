import Booking from "../models/booking.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, userName, email, mobile, address, studioId, studioTitle, price, services } = req.body;

    if (!userId || !userName || !email || !mobile || !address || !studioId || !studioTitle || !price) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBooking = new Booking({
      userId,
      userName,
      email,
      mobile,
      address,
      studioId,
      studioTitle,
      price,
      services,
    });

    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};
