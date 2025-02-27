import React, { useState, useEffect } from 'react';

export default function Home() {
  const [studios, setStudios] = useState([]);
  const [loading, setLoading] = useState(true);  // Added loading state
  const [error, setError] = useState(null);      // Added error state

  useEffect(() => {
    const fetchStudios = async () => {
      try {
        const res = await fetch('/api/studios/getstudio?page=1&limit=6');
        const data = await res.json();
        
        if (data && Array.isArray(data.studios)) {
          setStudios(data.studios);
        } else {
          throw new Error('Invalid data structure received.');
        }
      } catch (error) {
        setError(error.message); // Set error message if fetching fails
        console.error('Error fetching studios:', error);
      } finally {
        setLoading(false); // Set loading to false when the request is complete
      }
    };

    fetchStudios();
  }, []);

  if (loading) {
    return <div className="text-center text-xl">Loading studios...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-4xl font-bold my-8 text-gray-800">Explore Our Studios</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
        {studios.map((studio) => (
          <div key={studio._id} className="max-w-sm mx-auto bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300 ease-in-out">
            <img
              src={studio.mainImage}
              alt={studio.title}
              className="w-full h-56 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h2 className="text-2xl font-semibold text-gray-800">{studio.title}</h2>
              <p className="text-xl font-bold text-gray-700 mt-2">${studio.price}</p>
              <div className="flex justify-between mt-4">
                <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 focus:outline-none transition duration-200">Book Now</button>
                <button className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 focus:outline-none transition duration-200">Request Consultation</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
