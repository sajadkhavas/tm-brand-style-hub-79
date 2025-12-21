const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { File } = require('../models');
const { Op } = require('sequelize');

// Configure multer storage
const uploadsRoot = process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.folder || 'general';
    const uploadPath = path.join(uploadsRoot, 'files', folder);
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/webp', 'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('فرمت فایل مجاز نیست'), false);
    }
  }
});

/**
 * @route GET /api/files
 * @desc Get all files with pagination and filtering
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, folder, search, mimeType } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (folder) {
      whereClause.folder = folder;
    }
    
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { originalName: { [Op.iLike]: `%${search}%` } },
        { alt: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    if (mimeType) {
      whereClause.mimeType = { [Op.iLike]: `%${mimeType}%` };
    }

    const { count, rows } = await File.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت فایل‌ها' 
    });
  }
});

/**
 * @route POST /api/files/upload
 * @desc Upload single file
 */
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'فایلی انتخاب نشده است' 
      });
    }

    const folder = req.body.folder || 'general';
    const relativePath = `files/${folder}/${req.file.filename}`;
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;

    const file = await File.create({
      name: req.body.name || req.file.originalname,
      originalName: req.file.originalname,
      path: relativePath,
      url: `${baseUrl}/uploads/${relativePath}`,
      mimeType: req.file.mimetype,
      size: req.file.size,
      folder,
      alt: req.body.alt || '',
      description: req.body.description || ''
    });

    res.json({
      success: true,
      data: file
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در آپلود فایل' 
    });
  }
});

/**
 * @route POST /api/files/upload-multiple
 * @desc Upload multiple files
 */
router.post('/upload-multiple', upload.array('files', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'فایلی انتخاب نشده است' 
      });
    }

    const folder = req.body.folder || 'general';
    const baseUrl = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 3001}`;

    const files = await Promise.all(req.files.map(async (file) => {
      const relativePath = `files/${folder}/${file.filename}`;
      
      return File.create({
        name: file.originalname,
        originalName: file.originalname,
        path: relativePath,
        url: `${baseUrl}/uploads/${relativePath}`,
        mimeType: file.mimetype,
        size: file.size,
        folder,
        alt: '',
        description: ''
      });
    }));

    res.json({
      success: true,
      data: files
    });
  } catch (error) {
    console.error('Error uploading files:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در آپلود فایل‌ها' 
    });
  }
});

/**
 * @route DELETE /api/files/:id
 * @desc Delete a file
 */
router.delete('/:id', async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    
    if (!file) {
      return res.status(404).json({ 
        success: false, 
        error: 'فایل یافت نشد' 
      });
    }

    // Delete physical file
    const filePath = path.join(uploadsRoot, file.path);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete database record
    await file.destroy();

    res.json({
      success: true,
      message: 'فایل با موفقیت حذف شد'
    });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در حذف فایل' 
    });
  }
});

/**
 * @route GET /api/files/folders
 * @desc Get list of folders
 */
router.get('/folders', async (req, res) => {
  try {
    const folders = await File.findAll({
      attributes: [[File.sequelize.fn('DISTINCT', File.sequelize.col('folder')), 'folder']],
      raw: true
    });

    res.json({
      success: true,
      data: folders.map(f => f.folder)
    });
  } catch (error) {
    console.error('Error fetching folders:', error);
    res.status(500).json({ 
      success: false, 
      error: 'خطا در دریافت پوشه‌ها' 
    });
  }
});

module.exports = router;
