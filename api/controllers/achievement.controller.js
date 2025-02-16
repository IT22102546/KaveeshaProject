import Achievement from '../models/achievement.model.js';

// Create a new achievement
export const createAchievement = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const newAchievement = new Achievement({
      title,
      content,
      imageUrl,
    });

    await newAchievement.save();

    res.status(201).json({
      success: true,
      message: 'Achievement created successfully',
      achievement: newAchievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create achievement',
      error: error.message,
    });
  }
};

// Get all achievements
export const getAllAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find();
    res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievements',
      error: error.message,
    });
  }
};

// Get a single achievement by ID
export const getAchievementById = async (req, res) => {
  const { id } = req.params;

  try {
    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json({
      success: true,
      achievement,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch achievement',
      error: error.message,
    });
  }
};

// Delete an achievement by ID
export const deleteAchievementById = async (req, res) => {
  const { id } = req.params;

  try {
    const achievement = await Achievement.findByIdAndDelete(id);
    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: 'Achievement not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Achievement deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete achievement',
      error: error.message,
    });
  }
};

export const updateAchievementById = async (req, res) => {
    const { id } = req.params;
    const { title, content, imageUrl } = req.body;
  
    try {
      const updatedAchievement = await Achievement.findByIdAndUpdate(
        id,
        { title, content, imageUrl },
        { new: true } // Return the updated document
      );
  
      if (!updatedAchievement) {
        return res.status(404).json({
          success: false,
          message: 'Achievement not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Achievement updated successfully',
        achievement: updatedAchievement,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to update achievement',
        error: error.message,
      });
    }
  };
