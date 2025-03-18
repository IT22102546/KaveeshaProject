import express from 'express';
import { createStudio, getStudios, deleteStudio, updateStudio } from '../controllers/studios.controller.js';

const router = express.Router();

router.post('/create', createStudio);
router.get('/getstudio', getStudios);
router.delete('/delete/:id', deleteStudio);
router.put('/update/:id', updateStudio);

export default router;
