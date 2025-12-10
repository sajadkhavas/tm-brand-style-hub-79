require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./connection');
const { User, Category, Product, BlogPost } = require('../models');
const slugify = require('slugify');

const categories = [
  { name: 'هودی', nameEn: 'Hoodie', slug: 'hoodie', description: 'هودی‌های استایل استریت‌ویر' },
  { name: 'تیشرت', nameEn: 'T-Shirt', slug: 'tshirt', description: 'تیشرت‌های کژوال و راحت' },
  { name: 'شلوار', nameEn: 'Pants', slug: 'pants', description: 'شلوارهای کارگو و جین' },
  { name: 'کفش', nameEn: 'Shoes', slug: 'shoes', description: 'کتانی و کفش‌های اسپرت' },
  { name: 'کلاه', nameEn: 'Cap', slug: 'cap', description: 'کلاه‌های بیسبالی و بکت' }
];

const products = [
  {
    name: 'هودی مشکی TM-BRAND',
    nameEn: 'Black TM-BRAND Hoodie',
    slug: 'black-tm-hoodie',
    description: 'هودی مشکی پرمیوم با لوگوی TM-BRAND. جنس: پنبه 100٪، ضخیم و گرم',
    shortDescription: 'هودی مشکی پرمیوم با لوگو',
    price: 1850000,
    originalPrice: 2200000,
    discountPercent: 16,
    images: ['/uploads/products/hoodie-black.png'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [{ name: 'مشکی', hex: '#1a1a1a' }],
    stock: 45,
    stockStatus: 'inStock',
    isNew: true,
    isBestseller: true,
    isFeatured: true,
    gender: 'unisex',
    material: 'پنبه 100٪',
    categorySlug: 'hoodie'
  },
  {
    name: 'تیشرت سفید کلاسیک',
    nameEn: 'Classic White T-Shirt',
    slug: 'classic-white-tshirt',
    description: 'تیشرت سفید کلاسیک با لوگوی مینیمال. جنس: پنبه سوپیما',
    shortDescription: 'تیشرت سفید کلاسیک مینیمال',
    price: 650000,
    images: ['/uploads/products/tshirt-white.png'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'سفید', hex: '#ffffff' }],
    stock: 120,
    stockStatus: 'inStock',
    isBestseller: true,
    isFeatured: true,
    gender: 'unisex',
    material: 'پنبه سوپیما',
    categorySlug: 'tshirt'
  },
  {
    name: 'شلوار کارگو خاکی',
    nameEn: 'Cargo Pants Khaki',
    slug: 'cargo-pants-khaki',
    description: 'شلوار کارگو با جیب‌های کاربردی. جنس: کتان ضخیم',
    shortDescription: 'شلوار کارگو استایل میلیتاری',
    price: 1450000,
    images: ['/uploads/products/pants-cargo.png'],
    sizes: ['30', '32', '34', '36', '38'],
    colors: [{ name: 'خاکی', hex: '#8B7355' }],
    stock: 35,
    stockStatus: 'inStock',
    isNew: true,
    gender: 'men',
    material: 'کتان',
    categorySlug: 'pants'
  },
  {
    name: 'کتانی نئون',
    nameEn: 'Neon Sneakers',
    slug: 'neon-sneakers',
    description: 'کتانی با رنگ نئون چشمگیر. زیره: لاستیک طبیعی، رویه: مش تنفسی',
    shortDescription: 'کتانی نئون استریت‌ویر',
    price: 2350000,
    originalPrice: 2800000,
    discountPercent: 16,
    images: ['/uploads/products/sneakers-neon.png'],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [{ name: 'سبز نئون', hex: '#39FF14' }],
    stock: 20,
    stockStatus: 'lowStock',
    isFeatured: true,
    gender: 'unisex',
    material: 'مش و چرم مصنوعی',
    categorySlug: 'shoes'
  },
  {
    name: 'کلاه مشکی لوگو',
    nameEn: 'Black Logo Cap',
    slug: 'black-logo-cap',
    description: 'کلاه بیسبالی مشکی با لوگوی گلدوزی شده TM-BRAND',
    shortDescription: 'کلاه بیسبالی با لوگو',
    price: 380000,
    images: ['/uploads/products/cap-black.png'],
    sizes: ['Free Size'],
    colors: [{ name: 'مشکی', hex: '#1a1a1a' }],
    stock: 80,
    stockStatus: 'inStock',
    gender: 'unisex',
    categorySlug: 'cap'
  },
  {
    name: 'جین اسلیم فیت',
    nameEn: 'Slim Fit Jeans',
    slug: 'slim-fit-jeans',
    description: 'شلوار جین اسلیم فیت با کشش عالی. جنس: دنیم استرچ',
    shortDescription: 'جین اسلیم فیت راحت',
    price: 1250000,
    images: ['/uploads/products/jeans-slim.png'],
    sizes: ['30', '32', '34', '36'],
    colors: [{ name: 'آبی تیره', hex: '#1E3A5F' }],
    stock: 50,
    stockStatus: 'inStock',
    isBestseller: true,
    gender: 'men',
    material: 'دنیم استرچ',
    categorySlug: 'pants'
  }
];

const blogPosts = [
  {
    title: 'راهنمای استایل استریت‌ویر در ۱۴۰۳',
    slug: 'streetwear-style-guide-1403',
    excerpt: 'نکات کلیدی برای ست کردن لباس‌های استریت‌ویر و ایجاد یک استایل منحصر به فرد',
    content: 'استریت‌ویر یک سبک پوشاک است که از فرهنگ خیابانی الهام گرفته...',
    tag: 'استایل',
    readTime: '۵ دقیقه',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: 'معرفی کالکشن پاییز ۱۴۰۳',
    slug: 'fall-collection-1403',
    excerpt: 'مجموعه جدید پاییزی TM-BRAND با طراحی‌های خاص و متریال‌های باکیفیت',
    content: 'کالکشن پاییز امسال با تمرکز بر رنگ‌های گرم و متریال‌های طبیعی طراحی شده...',
    tag: 'کالکشن',
    readTime: '۳ دقیقه',
    isPublished: true,
    publishedAt: new Date()
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync database
    await sequelize.sync({ force: true });
    console.log('✅ Database synced (tables recreated)');

    // Create admin user
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 10);
    await User.create({
      email: process.env.ADMIN_EMAIL || 'admin@tm-brand.com',
      password: hashedPassword,
      fullName: 'مدیر سایت',
      role: 'admin'
    });
    console.log('✅ Admin user created');

    // Create categories
    const createdCategories = {};
    for (const cat of categories) {
      const created = await Category.create(cat);
      createdCategories[cat.slug] = created.id;
    }
    console.log('✅ Categories created');

    // Create products
    for (const prod of products) {
      const { categorySlug, ...productData } = prod;
      await Product.create({
        ...productData,
        categoryId: createdCategories[categorySlug]
      });
    }
    console.log('✅ Products created');

    // Create blog posts
    for (const post of blogPosts) {
      await BlogPost.create(post);
    }
    console.log('✅ Blog posts created');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`\n📧 Admin login: ${process.env.ADMIN_EMAIL || 'admin@tm-brand.com'}`);
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'admin123456'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
