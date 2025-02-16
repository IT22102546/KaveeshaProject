import express from 'express';
import { getActivities, createActivity, updateActivity, deleteActivity } from '../controllers/activities.controller.js';

const router = express.Router();

router.post('/create', createActivity);
router.get('/get', getActivities);
router.put('/update/:id', updateActivity);  
router.delete('/delete/:id', deleteActivity);  

export default router;
