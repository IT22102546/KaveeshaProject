
import Studio from '../models/studio.model.js';
import { errorHandler } from '../utils/error.js';


export const createStudio = async (req, res, next) => {
  try {
    const { title, description, price, images, mainImage,  services } = req.body;

    if (!title || !description || !price || !mainImage) {
      return next(errorHandler(400, 'Please provide all required fields'));
    }

    const slug = title.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '');

    const newStudio = new Studio({
      title,
      description,
      price,
      images: images || [],
      mainImage,
      services: services || [],
      slug,
    });

    const savedStudio = await newStudio.save();
    res.status(201).json(savedStudio);
  } catch (error) {
    next(error);
  }
};

export const getStudios = async (req, res, next) => {
  try {
    const { slug, searchTerm, page = 1, limit = 9, category, priceRange } = req.query;
    const queryOptions = {};

    if (slug) {
      queryOptions.slug = slug;
    }

    if (searchTerm) {
      queryOptions.title = { $regex: searchTerm, $options: 'i' };
    }

    if (category) {
      queryOptions.category = category;
    }

    if (priceRange) {
      const [minPrice, maxPrice] = priceRange.split('-').map(Number);
      queryOptions.price = { $gte: minPrice, $lte: maxPrice };
    }

    const totalStudios = await Studio.countDocuments(queryOptions);
    const studios = await Studio.find(queryOptions)
      .sort({ createdAt: -1 }) // Sort by createdAt field in descending order
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      studios,
      totalStudios,
      totalPages: Math.ceil(totalStudios / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    next(error);
  }
};