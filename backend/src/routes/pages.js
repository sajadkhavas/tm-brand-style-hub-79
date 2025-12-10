const express = require('express');
const router = express.Router();
const { Page } = require('../models');
const { Op } = require('sequelize');

// GET all published pages (public)
router.get('/', async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = {};
    // Default to published only for public API
    if (status === 'all') {
      // Admin can see all
    } else {
      where.status = 'published';
    }

    const pages = await Page.findAll({
      where,
      attributes: ['id', 'title', 'slug', 'excerpt', 'status', 'publishedAt', 'metaTitle', 'metaDescription', 'createdAt'],
      order: [['createdAt', 'DESC']]
    });

    res.json({ data: pages });
  } catch (error) {
    console.error('Error fetching pages:', error);
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// GET single page by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    const page = await Page.findOne({
      where: { 
        slug,
        status: 'published'
      }
    });

    if (!page) {
      return res.status(404).json({ error: 'Page not found' });
    }

    res.json({ data: page });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ error: 'Failed to fetch page' });
  }
});

module.exports = router;
