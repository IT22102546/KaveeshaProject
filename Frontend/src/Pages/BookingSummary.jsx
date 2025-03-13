import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function BookingSummary() {
  const location = useLocation();
  const bookingDetails = location.state;

  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i}:00 - ${i + 1}:00`);

  useEffect(() => {
    fetchBookedSlots();
  }, [selectedDate]);

  const fetchBookedSlots = async () => {
    try {
      const res = await fetch(`/api/bookings?studioId=${bookingDetails.studioId}&bookingDate=${selectedDate}`);
      const data = await res.json();
      if (res.ok) {
        setBookedSlots(data);
      } else {
        console.error("Error fetching bookings:", data.message);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  const handleBookSlot = async (slot) => {
    if (!bookingDetails.mobile || !bookingDetails.address) {
      alert("Please go to your profile and update your mobile number and address to proceed with booking.");
      return;
    }

    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...bookingDetails, timeSlot: slot, bookingDate: selectedDate }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking successful!");
        fetchBookedSlots();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Booking error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center">Booking Summary</h1>
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg mt-6">
        <img
          src={bookingDetails.mainImage || "https://via.placeholder.com/400"}
          alt={bookingDetails.studioTitle}
          className="w-full h-56 object-cover rounded-lg"
        />
        <h2 className="text-2xl font-semibold mt-4">{bookingDetails.studioTitle}</h2>
        <p className="text-lg text-gray-700">User: {bookingDetails.userName}</p>
        <p className="text-lg text-gray-700">Email: {bookingDetails.email}</p>
        <p className="text-lg text-gray-700">Mobile: {bookingDetails.mobile || "Not Provided"}</p>
        <p className="text-lg text-gray-700">Address: {bookingDetails.address || "Not Provided"}</p>

        {/* Show warning if details are missing */}
        {(!bookingDetails.mobile || !bookingDetails.address) && (
          <p className="text-red-500 text-center font-semibold mt-4">
            Please go to your profile and update your mobile number and address to proceed with booking.
          </p>
        )}

        {/* Date Picker */}
        <div className="mt-6">
          <label htmlFor="bookingDate" className="block text-lg font-semibold">
            Select Date:
          </label>
          <input
            type="date"
            id="bookingDate"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg mt-2"
          />
        </div>

        <h3 className="text-xl font-semibold mt-6">Select Time Slot:</h3>
        <table className="w-full mt-4 border border-gray-300">
          <tbody>
            {timeSlots.map((slot, index) => {
              const booking = bookedSlots.find((b) => b.timeSlot === slot);
              return (
                <tr key={index} className="border-b">
                  <td className="p-2">{slot}</td>
                  <td className="p-2 text-center">
                    {booking ? (
                      <span className="text-red-500">Booked by {booking.userName}</span>
                    ) : (
                      // Disable button if details are missing
                      bookingDetails.mobile && bookingDetails.address && (
                        <button
                          onClick={() => handleBookSlot(slot)}
                          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                        >
                          Book
                        </button>
                      )
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
