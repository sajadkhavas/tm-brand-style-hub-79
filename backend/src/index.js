require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./database/connection');
const { Page } = require('./models');
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
    'https://www.tm-brand.com',
    'http://45.149.78.122',
    'http://localhost:8080'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

async function seedDefaultPages() {
  const defaults = [
    {
      slug: 'about-us',
      title: 'درباره TM-BRAND',
      excerpt: 'برند پرمیوم استریت‌ویر و اسپرت برای نسل مدرن ایران',
      content:
        '<h2>درباره ما</h2><p>TM-BRAND برند استریت‌ویر و اسپرت ایرانی است که با الهام از سبک زندگی پویا، محصولات پرمیوم و باکیفیت ارائه می‌دهد.</p>',
      metaTitle: 'درباره TM-BRAND',
      metaDescription: 'آشنایی با برند استریت‌ویر TM-BRAND و مأموریت ما برای ارائه کیفیت پرمیوم.'
    },
    {
      slug: 'contact-us',
      title: 'تماس با TM-BRAND',
      excerpt: 'از طریق فرم تماس با ما در ارتباط باشید',
      content:
        JSON.stringify({
          hero: {
            subtitle: 'همیشه آماده شنیدن نظرات و پیشنهادات شما هستیم',
          },
          contactMethods: [
            { label: 'ایمیل', value: 'support@tm-brand.com', icon: 'mail' },
            { label: 'تلفن', value: '021-00000000', icon: 'phone' }
          ],
          faqs: [
            { question: 'زمان پاسخگویی چگونه است؟', answer: 'در روزهای کاری بین ۲۴ تا ۴۸ ساعت پاسخ می‌دهیم.' }
          ],
          html:
            '<p>برای هرگونه سؤال یا همکاری، فرم را تکمیل کنید یا از روش‌های زیر با ما در تماس باشید.</p>'
        }),
      metaTitle: 'تماس با TM-BRAND',
      metaDescription: 'راه‌های ارتباطی با TM-BRAND و ارسال پیام از طریق فرم تماس.'
    },
    {
      slug: 'terms',
      title: 'قوانین و مقررات',
      excerpt: 'شرایط استفاده از خدمات و خرید در TM-BRAND',
      content:
        '<h2>قوانین سایت</h2><p>استفاده از خدمات TM-BRAND به معنای پذیرش شرایط و قوانین خرید و مرجوعی است.</p>',
      metaTitle: 'قوانین و مقررات TM-BRAND',
      metaDescription: 'قوانین استفاده و خرید از TM-BRAND را مطالعه کنید.'
    },
    {
      slug: 'privacy',
      title: 'سیاست حفظ حریم خصوصی',
      excerpt: 'چگونگی جمع‌آوری و استفاده از داده‌های کاربران',
      content:
        '<h2>حریم خصوصی</h2><p>ما از اطلاعات شما برای بهبود تجربه خرید استفاده می‌کنیم و آن را ایمن نگه می‌داریم.</p>',
      metaTitle: 'حریم خصوصی TM-BRAND',
      metaDescription: 'اطلاعات شما در TM-BRAND چگونه حفاظت می‌شود.'
    },
    {
      slug: 'shipping',
      title: 'ارسال و تحویل',
      excerpt: 'شرایط ارسال سفارش‌ها در TM-BRAND',
      content:
        '<h2>سیاست ارسال</h2><p>ارسال سفارش‌ها در سریع‌ترین زمان ممکن انجام می‌شود و کد رهگیری در اختیار شما قرار می‌گیرد.</p>',
      metaTitle: 'ارسال سفارش TM-BRAND',
      metaDescription: 'جزئیات ارسال و تحویل سفارش در TM-BRAND.'
    },
    {
      slug: 'faq',
      title: 'سؤالات متداول',
      excerpt: 'پاسخ به پرسش‌های رایج مشتریان TM-BRAND',
      content:
        '<h2>سؤالات متداول</h2><p>پاسخ کوتاه به پرسش‌های عمومی مشتریان درباره سفارش، ارسال و پشتیبانی.</p>',
      metaTitle: 'سؤالات متداول TM-BRAND',
      metaDescription: 'پرسش و پاسخ درباره خرید از TM-BRAND.'
    }
  ];

  for (const page of defaults) {
    await Page.findOrCreate({
      where: { slug: page.slug },
      defaults: {
        ...page,
        status: 'published',
        publishedAt: new Date()
      }
    });
  }
}

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

    // Setup AdminJS first
    await setupAdmin(app);

    // Seed default CMS pages for first-time deployments
    await seedDefaultPages();

    // Body parsers must be registered after AdminJS to avoid router conflicts
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
