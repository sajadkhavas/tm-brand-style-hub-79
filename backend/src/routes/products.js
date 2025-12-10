const express = require('express');
const { Op } = require('sequelize');
const { Product, Category } = require('../models');

const router = express.Router();

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const {
      category,
      gender,
      minPrice,
      maxPrice,
      isNew,
      isBestseller,
      isFeatured,
      search,
      sort = 'createdAt',
      order = 'DESC',
      page = 1,
      limit = 20
    } = req.query;

    const where = { isActive: true };

    // Filters
    if (category) {
      const cat = await Category.findOne({ where: { slug: category } });
      if (cat) where.categoryId = cat.id;
    }
    if (gender) where.gender = gender;
    if (minPrice) where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };
    if (isNew === 'true') where.isNew = true;
    if (isBestseller === 'true') where.isBestseller = true;
    if (isFeatured === 'true') where.isFeatured = true;
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { nameEn: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    // Sorting
    let orderClause = [[sort, order]];
    if (sort === 'price-asc') orderClause = [['price', 'ASC']];
    if (sort === 'price-desc') orderClause = [['price', 'DESC']];

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: products, count } = await Product.findAndCountAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'nameEn', 'slug'] }],
      order: orderClause,
      limit: parseInt(limit),
      offset
    });

    res.json({
      data: products,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get featured products
router.get('/featured', async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { isActive: true, isFeatured: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'nameEn', 'slug'] }],
      limit: 8,
      order: [['createdAt', 'DESC']]
    });

    res.json({ data: products });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ error: 'Failed to fetch featured products' });
  }
});

// Get single product by slug
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug, isActive: true },
      include: [{ model: Category, as: 'category', attributes: ['id', 'name', 'nameEn', 'slug'] }]
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ data: product });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

module.exports = router;
