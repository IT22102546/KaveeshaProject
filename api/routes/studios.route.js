import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createStudio, getStudios } from '../controllers/studios.controller.js';


const router = express.Router();

router.post('/create',createStudio);
router.get('/getstudio',getStudios);


export default router;