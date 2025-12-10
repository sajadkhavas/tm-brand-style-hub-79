const express = require('express');
const { Category, Product } = require('../models');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      order: [['order', 'ASC'], ['name', 'ASC']],
      attributes: ['id', 'name', 'nameEn', 'slug', 'description', 'image']
    });

    res.json({ data: categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get single category with products
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [{
        model: Product,
        as: 'products',
        where: { isActive: true },
        required: false
      }]
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ data: category });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

module.exports = router;
