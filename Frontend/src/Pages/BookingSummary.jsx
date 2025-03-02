import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BookingSummary() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingDetails = location.state;

  if (!bookingDetails) {
    return <div className="text-center text-xl">No booking details found.</div>;
  }

  const handleConfirmBooking = async () => {
    try {
      const res = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingDetails), 
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking successful!");
        navigate("/success"); // Redirect after success
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
        <p className="text-lg text-gray-700 mt-2">Price: ${bookingDetails.price}</p>
        <p className="text-lg text-gray-700">User: {bookingDetails.userName}</p>
        <p className="text-lg text-gray-700">Email: {bookingDetails.email}</p>
        <p className="text-lg text-gray-700">Mobile: {bookingDetails.mobile}</p>
        <p className="text-lg text-gray-700">Address: {bookingDetails.address}</p>

        {/* Display services if available */}
        {bookingDetails.services.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Services Included:</h3>
            <ul className="list-disc list-inside text-gray-700">
              {bookingDetails.services.map((service, index) => (
                <li key={index}>{service}</li>
              ))}
            </ul>
          </div>
        )}

        <button
          onClick={handleConfirmBooking}
          className="bg-blue-500 text-white px-6 py-2 rounded-lg mt-4 w-full hover:bg-blue-600"
        >
          Confirm Booking
        </button>
      </div>
    </div>
  );
}
