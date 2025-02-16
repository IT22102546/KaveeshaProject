import Photo from '../models/photo.model.js';

// Create a new photo
export const createPhoto = async (req, res) => {
  try {
    const { title, imageUrl } = req.body;
    if (!title || !imageUrl) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newPhoto = new Photo({ title, imageUrl });
    await newPhoto.save();
    res.status(201).json(newPhoto);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all photos
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find(); // Fetch all photo records
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve photos", error });
  }
};

// Delete a photo
export const deletePhoto = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedPhoto = await Photo.findByIdAndDelete(id);
  
      if (!deletedPhoto) {
        return res.status(404).json({ message: 'Photo not found' });
      }
  
      res.status(200).json({ message: 'Photo deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  };
  
