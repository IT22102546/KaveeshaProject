// controllers/activity.controller.js
import Activity from '../models/activities.model.js';

export const createActivity = async (req, res) => {
  const { title, content, category, mainImage } = req.body;

  try {
    const newActivity = new Activity({
      title,
      content,
      category,
      mainImage, // Pass only the main image
    });

    const savedActivity = await newActivity.save();
    res.status(201).json({ message: 'Activity created successfully', slug: savedActivity._id });
  } catch (error) {
    res.status(500).json({ message: 'Error creating activity', error: error.message });
  }
};

export const getActivities = async (req, res) => {
    try {
      
      const activities = await Activity.find();
  
      
      const futureActivities = activities.filter(activity => activity.category === 'future');
      const presentActivities = activities.filter(activity => activity.category === 'present');
      const pastActivities = activities.filter(activity => activity.category === 'past');
  
  
      const latestFutureActivity = futureActivities.length > 0 ? futureActivities[0] : null;
  
      res.status(200).json({
        futureActivities,
        latestFutureActivity,
        presentActivities,
        pastActivities,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
  };

  export const updateActivity = async (req, res) => {
    const { id } = req.params;
    const { title, content, category, mainImage } = req.body;
  
    try {
   
      const updatedActivity = await Activity.findByIdAndUpdate(
        id,
        { title, content, category, mainImage }, 
        { new: true }
      );
  
      if (!updatedActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      res.status(200).json({ message: 'Activity updated successfully', activity: updatedActivity });
    } catch (error) {
      res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
  };
  

  export const deleteActivity = async (req, res) => {
    const { id } = req.params;
  
    try {
      // Find the activity by ID and delete it
      const deletedActivity = await Activity.findByIdAndDelete(id);
  
      if (!deletedActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
  
      res.status(200).json({ message: 'Activity deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting activity', error: error.message });
    }
  };
