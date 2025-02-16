import express from 'express';
import { createArticle, getAllArticles, getArticleById } from '../controllers/article.controller.js';


const router = express.Router();

// Get all articles
router.get('/getarticles', getAllArticles);

// Create new article
router.post('/create', createArticle);

// Get a single article by ID
router.get('/articles/:id', getArticleById);

export default router;
