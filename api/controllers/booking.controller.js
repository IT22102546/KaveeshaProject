import Booking from "../models/booking.model.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { userId, userName, email, mobile, address, studioId, studioTitle,  services, timeSlot, bookingDate } = req.body;

    // Validate required fields
    if (!userId || !userName || !email || !mobile || !address || !studioId || !studioTitle || !timeSlot || !bookingDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the time slot is already booked for the studio on the same date
    const isBooked = await Booking.exists({ studioId, timeSlot, bookingDate });
    if (isBooked) {
      return res.status(400).json({ message: "This time slot is already booked for the selected date" });
    }

    // Create a new booking
    const newBooking = new Booking({
      userId,
      userName,
      email,
      mobile,
      address,
      studioId,
      studioTitle,
      services,
      timeSlot,
      bookingDate: new Date(bookingDate), // Ensure the date is in the correct format
    });

    // Save the booking to the database
    await newBooking.save();
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get all booked slots for a specific studio and date
export const getBookings = async (req, res) => {
  try {
    const { studioId, bookingDate } = req.query;
    if (!studioId || !bookingDate) {
      return res.status(400).json({ message: "Studio ID and Booking Date are required" });
    }

    // Fetch all bookings for the studio on the selected date
    const bookings = await Booking.find({ studioId, bookingDate: new Date(bookingDate) }).select("timeSlot userName");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};