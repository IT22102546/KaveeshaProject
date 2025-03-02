import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa"; // Importing Font Awesome Check Circle

export default function SuccessPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/"); // Navigate to the home page
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full text-center">
        <div className="flex justify-center mb-6">
          {/* Using React Icons - FaCheckCircle */}
          <FaCheckCircle className="text-green-500 h-16 w-16" />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Success!</h1>
        <p className="text-lg text-gray-700 mb-6">
          Your booking was completed successfully. We look forward to serving you!
        </p>
        <button
          onClick={handleGoHome}
          className="bg-teal-500 text-white text-lg px-6 py-2 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
}
