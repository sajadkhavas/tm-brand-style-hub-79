const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.resolve(process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../../uploads'));
const productsDir = path.join(uploadDir, 'products');
const blogDir = path.join(uploadDir, 'blog');
const pagesDir = path.join(uploadDir, 'pages');

[uploadDir, productsDir, blogDir, pagesDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Multer configuration
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, and WebP images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  }
});

// Upload product image (single)
router.post('/product', verifyToken, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(productsDir, filename);

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(filepath);

    const url = `/uploads/products/${filename}`;

    res.json({
      url,
      filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload blog image
router.post('/blog', verifyToken, adminOnly, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(blogDir, filename);

    // Process image with Sharp
    await sharp(req.file.buffer)
      .resize(1600, 900, { fit: 'cover' })
      .webp({ quality: 85 })
      .toFile(filepath);

    const url = `/uploads/blog/${filename}`;

    res.json({
      url,
      filename,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Multi-upload endpoint for AdminJS rich text/images
router.post('/multiple', verifyToken, adminOnly, upload.array('images', 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const target = req.query.type || 'products';
    const targetDir = path.join(uploadDir, target);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const results = [];
    for (const file of req.files) {
      const filename = `${uuidv4()}.webp`;
      const filepath = path.join(targetDir, filename);
      await sharp(file.buffer)
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(filepath);

      results.push({
        url: `/uploads/${target}/${filename}`,
        filename,
      });
    }

    res.json({ files: results });
  } catch (error) {
    console.error('Multi-upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Delete image
router.delete('/:type/:filename', verifyToken, adminOnly, async (req, res) => {
  try {
    const { type, filename } = req.params;
    
    if (!['products', 'blog'].includes(type)) {
      return res.status(400).json({ error: 'Invalid upload type' });
    }

    const filepath = path.join(uploadDir, type, filename);
    
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
      res.json({ message: 'Image deleted successfully' });
    } else {
      res.status(404).json({ error: 'Image not found' });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

module.exports = router;
