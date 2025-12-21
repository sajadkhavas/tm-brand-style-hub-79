const express = require('express');
const router = express.Router();
const { Setting } = require('../models');

/**
 * @route GET /api/settings
 * @desc Get all settings
 */
router.get('/', async (req, res) => {
  try {
    const { group } = req.query;
    
    const whereClause = group ? { group } : {};
    
    const settings = await Setting.findAll({
      where: whereClause,
      order: [['group', 'ASC'], ['key', 'ASC']]
    });

    // Transform to key-value object for easier frontend use
    const settingsObject = {};
    settings.forEach(s => {
      if (!settingsObject[s.group]) {
        settingsObject[s.group] = {};
      }
      
      let value = s.value;
      if (s.type === 'boolean') {
        value = s.value === 'true';
      } else if (s.type === 'number') {
        value = parseFloat(s.value);
      } else if (s.type === 'json') {
        try {
          value = JSON.parse(s.value);
        } catch (e) {
          value = s.value;
        }
      }
      
      settingsObject[s.group][s.key] = value;
    });

    res.json({
      success: true,
      data: settingsObject
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت تنظیمات' 
    });
  }
});

/**
 * @route GET /api/settings/:key
 * @desc Get single setting by key
 */
router.get('/:key', async (req, res) => {
  try {
    const setting = await Setting.findOne({
      where: { key: req.params.key }
    });

    if (!setting) {
      return res.status(404).json({ 
        success: false, 
        error: 'تنظیم یافت نشد' 
      });
    }

    res.json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error('Error fetching setting:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت تنظیم' 
    });
  }
});

module.exports = router;
