import Article from '../models/article.model.js';

// Fetch all articles
export const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching articles', error: err });
  }
};

// Create a new article
export const createArticle = async (req, res) => {
  const { title, content, author, imageUrl } = req.body;
  try {
    const newArticle = new Article({ title, content, author, imageUrl });
    await newArticle.save();
    res.status(201).json(newArticle);
  } catch (err) {
    res.status(500).json({ message: 'Error creating article', error: err });
  }
};

// Get a single article
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching article', error: err });
  }
};
