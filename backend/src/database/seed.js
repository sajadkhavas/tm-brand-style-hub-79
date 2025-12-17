require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./connection');
const { User, Category, Product, BlogPost, Page } = require('../models');
const slugify = require('slugify');

const categories = [
  {
    name: 'هودی',
    nameEn: 'Hoodie',
    slug: 'hoodie',
    description: 'هودی‌های استریت‌ویر پریمیوم با داخل کرکی و فیت اورسایز',
    image: '/uploads/categories/hoodie-placeholder.webp',
    order: 1
  },
  {
    name: 'تیشرت',
    nameEn: 'T-Shirt',
    slug: 'tshirt',
    description: 'تیشرت‌های نخی وزن بالا با چاپ اختصاصی TM-BRAND',
    image: '/uploads/categories/tshirt-placeholder.webp',
    order: 2
  },
  {
    name: 'شلوار',
    nameEn: 'Pants',
    slug: 'pants',
    description: 'شلوارهای کارگو، جین و پارچه‌ای برای استایل خیابانی',
    image: '/uploads/categories/pants-placeholder.webp',
    order: 3
  },
  {
    name: 'کفش',
    nameEn: 'Shoes',
    slug: 'shoes',
    description: 'کتانی و بوت‌های سبک خیابانی و رانینگ',
    image: '/uploads/categories/shoes-placeholder.webp',
    order: 4
  },
  {
    name: 'کلاه',
    nameEn: 'Cap',
    slug: 'cap',
    description: 'کلاه‌های بیسبالی، اسنپ‌بک و بکت با لوگوی TM-BRAND',
    image: '/uploads/categories/cap-placeholder.webp',
    order: 5
  }
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
    categorySlug: 'hoodie',
    order: 1,
    variants: [
      { sku: 'TMH-BLK-S', size: 'S', color: 'مشکی', stock: 8 },
      { sku: 'TMH-BLK-M', size: 'M', color: 'مشکی', stock: 12 },
      { sku: 'TMH-BLK-L', size: 'L', color: 'مشکی', stock: 10 }
    ]
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
    categorySlug: 'tshirt',
    order: 2,
    variants: [
      { sku: 'TMS-WHT-M', size: 'M', color: 'سفید', stock: 30 },
      { sku: 'TMS-WHT-L', size: 'L', color: 'سفید', stock: 40 },
      { sku: 'TMS-WHT-XL', size: 'XL', color: 'سفید', stock: 30 }
    ]
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
    categorySlug: 'pants',
    order: 3,
    variants: [
      { sku: 'TM-PNT-32', size: '32', color: 'خاکی', stock: 8 },
      { sku: 'TM-PNT-34', size: '34', color: 'خاکی', stock: 7 },
      { sku: 'TM-PNT-36', size: '36', color: 'خاکی', stock: 6 }
    ]
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
    categorySlug: 'shoes',
    order: 4,
    variants: [
      { sku: 'TM-SNK-42', size: '42', color: 'نئون', stock: 3 },
      { sku: 'TM-SNK-43', size: '43', color: 'نئون', stock: 3 },
      { sku: 'TM-SNK-44', size: '44', color: 'نئون', stock: 2 }
    ]
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
    categorySlug: 'cap',
    order: 5,
    variants: [
      { sku: 'TM-CAP-01', size: 'Free', color: 'مشکی', stock: 50 }
    ]
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
    categorySlug: 'pants',
    order: 6,
    variants: [
      { sku: 'TM-JNS-32', size: '32', color: 'آبی تیره', stock: 12 },
      { sku: 'TM-JNS-34', size: '34', color: 'آبی تیره', stock: 10 },
      { sku: 'TM-JNS-36', size: '36', color: 'آبی تیره', stock: 8 }
    ]
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

const pages = [
  {
    title: 'درباره ما',
    slug: 'about-us',
    excerpt: 'درباره TM-BRAND و داستان ما',
    content: `<h2>داستان TM-BRAND</h2>
<p>TM-BRAND در سال ۱۳۹۸ با هدف ارائه پوشاک استریت‌ویر با کیفیت و طراحی منحصر به فرد تاسیس شد.</p>
<h3>ماموریت ما</h3>
<p>ما معتقدیم که هر فردی استحقاق داشتن استایل منحصر به فرد خود را دارد. محصولات ما با الهام از فرهنگ خیابانی و با توجه به کیفیت و راحتی طراحی می‌شوند.</p>
<h3>ارزش‌های ما</h3>
<ul>
<li>کیفیت بی‌نظیر در هر محصول</li>
<li>طراحی‌های خلاقانه و منحصر به فرد</li>
<li>احترام به محیط زیست</li>
<li>رضایت مشتری</li>
</ul>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'درباره ما | TM-BRAND',
    metaDescription: 'با TM-BRAND آشنا شوید - برند پوشاک استریت‌ویر ایرانی با کیفیت بالا و طراحی منحصر به فرد',
    images: ['/uploads/pages/about-hero.webp']
  },
  {
    title: 'تماس با ما',
    slug: 'contact-us',
    excerpt: 'راه‌های ارتباط با TM-BRAND',
    content: `<h2>با ما در تماس باشید</h2>
<p>سوالی دارید؟ ما اینجاییم تا کمکتان کنیم.</p>
<h3>اطلاعات تماس</h3>
<ul>
<li><strong>ایمیل:</strong> info@tm-brand.com</li>
<li><strong>تلفن:</strong> ۰۲۱-۱۲۳۴۵۶۷۸</li>
<li><strong>واتس‌اپ:</strong> ۰۹۱۲۱۲۳۴۵۶۷</li>
</ul>
<h3>آدرس</h3>
<p>تهران، خیابان ولیعصر، پلاک ۱۲۳</p>
<h3>ساعات کاری</h3>
<p>شنبه تا پنج‌شنبه: ۹ صبح تا ۶ عصر</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'تماس با ما | TM-BRAND',
    metaDescription: 'با TM-BRAND تماس بگیرید - پشتیبانی، سفارشات و سوالات',
    images: ['/uploads/pages/contact-hero.webp']
  },
  {
    title: 'سوالات متداول',
    slug: 'faq',
    excerpt: 'پاسخ به سوالات رایج مشتریان',
    content: `<h2>سوالات متداول</h2>
<h3>ارسال و تحویل</h3>
<p><strong>زمان ارسال چقدر است؟</strong></p>
<p>سفارشات معمولاً ظرف ۲ تا ۵ روز کاری ارسال می‌شوند.</p>

<p><strong>هزینه ارسال چقدر است؟</strong></p>
<p>برای سفارش‌های بالای ۲ میلیون تومان، ارسال رایگان است.</p>

<h3>تعویض و مرجوعی</h3>
<p><strong>آیا امکان تعویض وجود دارد؟</strong></p>
<p>بله، تا ۷ روز پس از دریافت می‌توانید محصول را تعویض کنید.</p>

<h3>پرداخت</h3>
<p><strong>چه روش‌های پرداختی پشتیبانی می‌شود؟</strong></p>
<p>درگاه بانکی، کارت به کارت و پرداخت در محل.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'سوالات متداول | TM-BRAND',
    metaDescription: 'پاسخ به سوالات متداول درباره خرید، ارسال و مرجوعی محصولات TM-BRAND',
    images: ['/uploads/pages/faq-hero.webp']
  },
  {
    title: 'قوانین و مقررات',
    slug: 'terms',
    excerpt: 'شرایط و قوانین استفاده از خدمات TM-BRAND',
    content: `<h2>قوانین و مقررات</h2>
<p>با خرید از فروشگاه TM-BRAND، شما شرایط زیر را می‌پذیرید:</p>
<h3>شرایط خرید</h3>
<p>تمامی قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده هستند.</p>
<h3>حریم خصوصی</h3>
<p>اطلاعات شخصی شما نزد ما محفوظ است و به هیچ شخص ثالثی ارائه نمی‌شود.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'قوانین و مقررات | TM-BRAND',
    metaDescription: 'شرایط استفاده و قوانین فروشگاه TM-BRAND',
    images: ['/uploads/pages/terms-hero.webp']
  },
  {
    title: 'حریم خصوصی',
    slug: 'privacy',
    excerpt: 'نحوه جمع‌آوری و نگهداری داده‌های کاربران',
    content: `<h2>سیاست حریم خصوصی</h2>
<p>TM-BRAND اطلاعات شخصی شما را تنها برای پردازش سفارش و بهبود تجربه کاربری استفاده می‌کند.</p>
<h3>اطلاعات جمع‌آوری‌شده</h3>
<p>نام، ایمیل، شماره تماس، آدرس و تاریخچه سفارش‌ها.</p>
<h3>امنیت داده</h3>
<p>تمامی داده‌ها روی سرورهای ایمن نگهداری و از رمزنگاری در زمان انتقال استفاده می‌شود.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'حریم خصوصی | TM-BRAND',
    metaDescription: 'سیاست حریم خصوصی و امنیت داده‌های مشتریان TM-BRAND',
    images: ['/uploads/pages/privacy-hero.webp']
  },
  {
    title: 'ارسال و تحویل',
    slug: 'shipping',
    excerpt: 'شرایط و زمان‌بندی ارسال سفارش‌ها',
    content: `<h2>ارسال و تحویل</h2>
<p>ارسال سفارش‌ها بین ۲ تا ۵ روز کاری انجام می‌شود. سفارش‌های بالای ۲ میلیون تومان رایگان ارسال می‌شوند.</p>
<h3>روش‌های ارسال</h3>
<ul>
<li>پیک ویژه تهران</li>
<li>پست پیشتاز برای شهرستان‌ها</li>
<li>امکان تحویل حضوری با هماهنگی قبلی</li>
</ul>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'ارسال و تحویل | TM-BRAND',
    metaDescription: 'جزئیات ارسال، هزینه و زمان‌بندی تحویل سفارش‌های TM-BRAND',
    images: ['/uploads/pages/shipping-hero.webp']
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

    // Create pages
    for (const page of pages) {
      await Page.create(page);
    }
    console.log('✅ Pages created');

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
