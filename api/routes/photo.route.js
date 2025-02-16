import express from 'express';
import { createPhoto, getAllPhotos, deletePhoto } from '../controllers/photo.controller.js';

const router = express.Router();

router.post('/create', createPhoto);
router.get('/all', getAllPhotos);
router.delete('/delete/:id/:userId', deletePhoto); 

export default router;
