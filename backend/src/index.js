require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { sequelize } = require('./database/connection');
const { Page, Menu, Setting } = require('./models');
const setupAdmin = require('./admin');

// Import Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const blogRoutes = require('./routes/blog');
const orderRoutes = require('./routes/orders');
const uploadRoutes = require('./routes/upload');
const pageRoutes = require('./routes/pages');
const contactRoutes = require('./routes/contact');
const menuRoutes = require('./routes/menu');
const fileRoutes = require('./routes/files');
const settingsRoutes = require('./routes/settings');

const app = express();
const PORT = process.env.PORT || 3001;
app.set('trust proxy', 1);

// CORS Configuration
const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:5173',
      'https://shine-web.co',
      'http://shine-web.co',
      'https://www.shine-web.co',
      'http://45.149.78.122',
      'http://localhost:8080'
    ];
    
    // Allow Lovable preview domains
    if (!origin || 
        allowedOrigins.includes(origin) || 
        origin.endsWith('.lovable.app') || 
        origin.endsWith('.lovableproject.com')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(morgan('combined'));

// Static files for uploads
const uploadsPath = path.resolve(process.env.FILE_UPLOAD_PATH || path.join(__dirname, '../uploads'));
app.use('/uploads', express.static(uploadsPath));

// Seed default data
async function seedDefaults() {
  // Default pages
  const defaultPages = [
    { slug: 'about-us', title: 'درباره ما', content: '<h2>درباره ما</h2><p>محتوای صفحه درباره ما</p>', status: 'published' },
    { slug: 'contact-us', title: 'تماس با ما', content: '<h2>تماس با ما</h2><p>اطلاعات تماس</p>', status: 'published' },
    { slug: 'terms', title: 'قوانین و مقررات', content: '<h2>قوانین</h2>', status: 'published' },
    { slug: 'privacy', title: 'حریم خصوصی', content: '<h2>حریم خصوصی</h2>', status: 'published' },
    { slug: 'faq', title: 'سوالات متداول', content: '<h2>سوالات متداول</h2>', status: 'published' },
  ];

  for (const page of defaultPages) {
    await Page.findOrCreate({ where: { slug: page.slug }, defaults: { ...page, publishedAt: new Date() } });
  }

  // Default menu items
  const defaultMenus = [
    { title: 'خانه', url: '/', order: 1, location: 'header', isActive: true },
    { title: 'فروشگاه', url: '/shop', order: 2, location: 'header', isActive: true },
    { title: 'درباره ما', url: '/about', order: 3, location: 'header', isActive: true },
    { title: 'وبلاگ', url: '/blog', order: 4, location: 'header', isActive: true },
    { title: 'تماس با ما', url: '/contact', order: 5, location: 'header', isActive: true },
  ];

  for (const menu of defaultMenus) {
    await Menu.findOrCreate({ where: { url: menu.url, location: menu.location }, defaults: menu });
  }
}

// Initialize database and start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced');
    }

    await setupAdmin(app);
    await seedDefaults();

    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/blog', blogRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/pages', pageRoutes);
    app.use('/api/contact', contactRoutes);
    app.use('/api/menu', menuRoutes);
    app.use('/api/files', fileRoutes);
    app.use('/api/settings', settingsRoutes);

    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    app.use((err, req, res, next) => {
      console.error('Error:', err);
      res.status(err.status || 500).json({ error: { message: err.message || 'Internal Server Error' } });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Admin panel: http://localhost:${PORT}/admin (shine-web.co)`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
