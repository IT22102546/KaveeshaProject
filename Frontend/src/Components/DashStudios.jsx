import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashStudios() {
  const [studios, setStudios] = useState([]);
  const [selectedStudio, setSelectedStudio] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainImage: "",
    services: "",
  });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    fetch("/api/studios/getstudio")
      .then((res) => res.json())
      .then((data) => setStudios(data.studios))
      .catch((err) => console.error(err));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this studio?")) {
      try {
        const response = await fetch(`/api/studios/delete/${id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setStudios(studios.filter((studio) => studio._id !== id));
        }
      } catch (error) {
        console.error("Error deleting studio:", error);
      }
    }
  };

  const handleUpdateClick = (studio) => {
    setSelectedStudio(studio);
    setFormData({
      title: studio.title,
      description: studio.description,
      mainImage: studio.mainImage,
      services: studio.services.join(", "),
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUploadImage = () => {
    if (!file) {
      setUploadError("Please select an image");
      return;
    }
    setUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setUploadError("Image upload failed");
        console.error(error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setFormData((prevData) => ({ ...prevData, mainImage: downloadURL }));
        setUploadProgress(null);
        setFile(null);
      }
    );
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`/api/studios/update/${selectedStudio._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          services: formData.services.split(",").map((s) => s.trim()),
        }),
      });
      if (response.ok) {
        const updatedStudio = await response.json();
        setStudios(studios.map((studio) => (studio._id === updatedStudio._id ? updatedStudio : studio)));
        setSelectedStudio(null);
      }
    } catch (error) {
      console.error("Error updating studio:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Studios</h2>
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Main Image</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-6">{studio.title}</td>
                <td className="py-3 px-6">{studio.description}</td>
                <td className="py-3 px-6">
                  <img src={studio.mainImage} alt={studio.title} className="w-14 h-14 rounded-md object-cover" />
                </td>
                <td className="py-3 px-6 text-center">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600" onClick={() => handleUpdateClick(studio)}>
                    Update
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600" onClick={() => handleDelete(studio._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedStudio && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-800">Update Studio</h3>

            {/* Display current image */}
            {formData.mainImage && (
              <img src={formData.mainImage} alt="Current" className="w-full h-40 object-cover rounded-md mb-2" />
            )}

            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button onClick={handleUploadImage} className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600">
              Upload Image
            </button>

            {uploadProgress && (
              <CircularProgressbar value={uploadProgress} text={`${uploadProgress}%`} className="w-14 h-14 mt-2" />
            )}
            {uploadError && <p className="text-red-500">{uploadError}</p>}

            <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 mt-2" />
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" rows="4" className="w-full px-3 py-2 border rounded-md focus:ring focus:ring-blue-200 mt-2" />

            <button className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600 mt-4" onClick={handleUpdate}>
              Save
            </button>
            <button className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 mt-4" onClick={() => setSelectedStudio(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
