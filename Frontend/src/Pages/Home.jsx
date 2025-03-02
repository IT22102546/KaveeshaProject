import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStudio, setExpandedStudio] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await fetch("/api/studios/getstudio?page=1&limit=6");
        const data = await res.json();

        if (data && Array.isArray(data.studios)) {
          setStudios(data.studios);
        } else {
          throw new Error("Invalid data structure received.");
        }
      } catch (error) {
        setError(error.message);
        console.error("Error fetching studios:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, []);

  const handleBooking = (studio) => {
    if (!currentUser) {
      alert("Please log in to book a studio");
      return;
    }
  
    navigate("/booking-summary", {
      state: {
        userId: currentUser._id,
        userName: currentUser.username,
        email: currentUser.email,      
        mobile: currentUser.mobile,    
        address: currentUser.adress,  
        studioId: studio._id,
        studioTitle: studio.title,
        price: studio.price,
        mainImage: studio.mainImage,
        services: studio.services || [],
      },
    });
  };
  
  if (loading) {
    return <div className="text-center text-xl">Loading studios...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold my-8 text-gray-800">
        Explore Our Studios
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {studios.map((studio) => (
          <div
            key={studio._id}
            className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out"
          >
            <img
              src={studio.mainImage || "https://via.placeholder.com/400"}
              alt={studio.title || "Studio Image"}
              className="w-full h-56 object-cover rounded-t-lg"
            />

            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                {studio.title || "No Title"}
              </h2>
              <p className="text-xl font-bold text-gray-700 mt-2">
                ${studio.price || "N/A"}
              </p>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleBooking(studio)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none transition duration-200"
                >
                  Book Now
                </button>
                <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 focus:outline-none transition duration-200">
                  Request Consultation
                </button>
              </div>

              <button
                onClick={() =>
                  setExpandedStudio(expandedStudio === studio._id ? null : studio._id)
                }
                className="mt-4 text-blue-500 underline focus:outline-none"
              >
                {expandedStudio === studio._id ? "Show Less" : "Show More"}
              </button>

              {expandedStudio === studio._id && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <p className="text-gray-700">
                    {studio.description || "No description available."}
                  </p>

                  {studio.services?.length > 0 && (
                    <>
                      <h3 className="mt-3 font-semibold text-lg text-gray-800">
                        Services Offered:
                      </h3>
                      <ul className="list-disc list-inside text-gray-700">
                        {studio.services.map((service, index) => (
                          <li key={index}>{service}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  {studio.otherImages?.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2">
                      {studio.otherImages.map((image, index) => (
                        <img
                          key={index}
                          src={image || "https://via.placeholder.com/150"}
                          alt={`Additional view ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
