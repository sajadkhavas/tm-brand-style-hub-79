const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const { verifyToken, adminOnly } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
const productsDir = path.join(uploadDir, 'products');
const blogDir = path.join(uploadDir, 'blog');

[uploadDir, productsDir, blogDir].forEach(dir => {
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

// Upload product image
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
