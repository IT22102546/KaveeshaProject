
import Bearer from '../models/bearers.model.js';


export const createBearer = async (req, res) => {
  try {
    const { name, imageUrl, details } = req.body;
    const newBearer = new Bearer({ name, imageUrl, details });
    await newBearer.save();
    res.status(201).json(newBearer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBearers = async (req, res) => {
  try {
    const bearers = await Bearer.find();
    res.status(200).json(bearers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBearer = async (req, res) => {
  try {
    const { id } = req.params;
    await Bearer.findByIdAndDelete(id);
    res.status(200).json({ message: 'Bearer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateBearer = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    const updatedBearer = await Bearer.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updatedBearer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
