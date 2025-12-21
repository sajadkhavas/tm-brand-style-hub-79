const express = require('express');
const router = express.Router();
const { Menu } = require('../models');
const { Op } = require('sequelize');

/**
 * @route GET /api/menu
 * @desc Get all active menu items with nested structure
 */
router.get('/', async (req, res) => {
  try {
    const { location } = req.query;
    
    const whereClause = { 
      isActive: true,
      parentId: null // Only top-level items
    };
    
    if (location && location !== 'all') {
      whereClause.location = { [Op.in]: [location, 'both'] };
    }

    const menuItems = await Menu.findAll({
      where: whereClause,
      order: [['order', 'ASC'], ['createdAt', 'ASC']],
      include: [{
        model: Menu,
        as: 'children',
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']],
        include: [{
          model: Menu,
          as: 'children',
          where: { isActive: true },
          required: false,
          order: [['order', 'ASC']]
        }]
      }]
    });

    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching menu:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت منو' 
    });
  }
});

/**
 * @route GET /api/menu/header
 * @desc Get header menu items
 */
router.get('/header', async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      where: { 
        isActive: true,
        parentId: null,
        location: { [Op.in]: ['header', 'both'] }
      },
      order: [['order', 'ASC']],
      include: [{
        model: Menu,
        as: 'children',
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']]
      }]
    });

    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching header menu:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت منو' 
    });
  }
});

/**
 * @route GET /api/menu/footer
 * @desc Get footer menu items
 */
router.get('/footer', async (req, res) => {
  try {
    const menuItems = await Menu.findAll({
      where: { 
        isActive: true,
        parentId: null,
        location: { [Op.in]: ['footer', 'both'] }
      },
      order: [['order', 'ASC']],
      include: [{
        model: Menu,
        as: 'children',
        where: { isActive: true },
        required: false,
        order: [['order', 'ASC']]
      }]
    });

    res.json({
      success: true,
      data: menuItems
    });
  } catch (error) {
    console.error('Error fetching footer menu:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت منو' 
    });
  }
});

module.exports = router;
