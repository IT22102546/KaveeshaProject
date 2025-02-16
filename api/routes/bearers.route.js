// src/routes/bearers.js
import express from 'express';
import { createBearer, deleteBearer, getAllBearers, updateBearer } from '../controllers/bearers.controller.js';

const router = express.Router();

router.post('/create', createBearer);
router.get('/', getAllBearers);
router.delete('/delete/:id', deleteBearer); 
router.put('/update/:id', updateBearer);    

export default router;
