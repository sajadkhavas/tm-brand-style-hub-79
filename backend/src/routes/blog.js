const express = require('express');
const { BlogPost, User } = require('../models');

const router = express.Router();

// Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, tag } = req.query;
    
    const where = { isPublished: true };
    if (tag) where.tag = tag;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { rows: posts, count } = await BlogPost.findAndCountAll({
      where,
      include: [{ model: User, as: 'author', attributes: ['id', 'fullName'] }],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.json({
      data: posts,
      meta: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// Get single blog post by slug
router.get('/:slug', async (req, res) => {
  try {
    const post = await BlogPost.findOne({
      where: { slug: req.params.slug, isPublished: true },
      include: [{ model: User, as: 'author', attributes: ['id', 'fullName'] }]
    });

    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json({ data: post });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

module.exports = router;
