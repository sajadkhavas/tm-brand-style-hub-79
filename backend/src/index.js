require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./database/connection');
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

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration
const corsOptions = {
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    process.env.PRODUCTION_FRONTEND_URL || 'https://tm-brand.com',
    'http://localhost:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/contact', contactRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (in development)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database models synced');
    }

    // Setup AdminJS
    await setupAdmin(app);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Admin panel: http://localhost:${PORT}/admin`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
}

startServer();
