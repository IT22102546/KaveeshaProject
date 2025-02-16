import express from 'express';
import { createAchievement, getAllAchievements, getAchievementById, deleteAchievementById, updateAchievementById } from '../controllers/achievement.controller.js';

const router = express.Router();

router.post('/create', createAchievement);
router.get('/', getAllAchievements);
router.get('/:id', getAchievementById);
router.delete('/delete/:id', deleteAchievementById);
router.put('/update/:id', updateAchievementById); 

export default router;
