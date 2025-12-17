require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize } = require('./connection');
const { User, Category, Product, BlogPost, Page } = require('../models');
const slugify = require('slugify');

const categories = [
  { 
    name: 'هودی و سویشرت', 
    nameEn: 'Hoodie', 
    slug: 'hoodie', 
    description: 'هودی‌های استایل استریت‌ویر',
    icon: '🧥',
    image: '/uploads/categories/hoodie.png',
    isActive: true,
    order: 1
  },
  { 
    name: 'تیشرت', 
    nameEn: 'T-Shirt', 
    slug: 'tshirt', 
    description: 'تیشرت‌های کژوال و راحت',
    icon: '👕',
    image: '/uploads/categories/tshirt.png',
    isActive: true,
    order: 2
  },
  { 
    name: 'شلوار', 
    nameEn: 'Pants', 
    slug: 'pants', 
    description: 'شلوارهای کارگو و جین',
    icon: '👖',
    image: '/uploads/categories/pants.png',
    isActive: true,
    order: 3
  },
  { 
    name: 'شلوار جین', 
    nameEn: 'Jeans', 
    slug: 'jeans', 
    description: 'شلوارهای جین با کیفیت',
    icon: '👖',
    image: '/uploads/categories/jeans.png',
    isActive: true,
    order: 4
  },
  { 
    name: 'کفش', 
    nameEn: 'Shoes', 
    slug: 'shoes', 
    description: 'کتانی و کفش‌های اسپرت',
    icon: '👟',
    image: '/uploads/categories/shoes.png',
    isActive: true,
    order: 5
  },
  { 
    name: 'اکسسوری', 
    nameEn: 'Accessories', 
    slug: 'accessories', 
    description: 'کلاه، کیف و اکسسوری‌ها',
    icon: '🎒',
    image: '/uploads/categories/accessories.png',
    isActive: true,
    order: 6
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
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
    isActive: true,
    gender: 'unisex',
    categorySlug: 'accessories'
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
    isActive: true,
    gender: 'men',
    material: 'دنیم استرچ',
    categorySlug: 'jeans'
  }
];

const blogPosts = [
  {
    title: 'راهنمای استایل استریت‌ویر در ۱۴۰۳',
    slug: 'streetwear-style-guide-1403',
    excerpt: 'نکات کلیدی برای ست کردن لباس‌های استریت‌ویر و ایجاد یک استایل منحصر به فرد',
    content: `<h2>راهنمای کامل استایل استریت‌ویر</h2>
<p>استریت‌ویر یک سبک پوشاک است که از فرهنگ خیابانی الهام گرفته و در دهه‌های اخیر به یکی از محبوب‌ترین سبک‌های مد تبدیل شده است.</p>
<h3>۱. هودی و سویشرت</h3>
<p>هودی‌های اورسایز یکی از ارکان اصلی استایل استریت‌ویر هستند. آن‌ها را با شلوار جین یا کارگو ست کنید.</p>
<h3>۲. کفش مناسب</h3>
<p>کتانی‌های کلاسیک یا مدل‌های chunky انتخاب‌های عالی برای این سبک هستند.</p>
<h3>۳. اکسسوری</h3>
<p>کلاه، زنجیر و کیف کمری می‌توانند استایل شما را کامل کنند.</p>`,
    tag: 'استایل',
    readTime: '۵ دقیقه',
    isPublished: true,
    publishedAt: new Date()
  },
  {
    title: 'معرفی کالکشن پاییز ۱۴۰۳',
    slug: 'fall-collection-1403',
    excerpt: 'مجموعه جدید پاییزی TM-BRAND با طراحی‌های خاص و متریال‌های باکیفیت',
    content: `<h2>کالکشن پاییز ۱۴۰۳</h2>
<p>کالکشن پاییز امسال با تمرکز بر رنگ‌های گرم و متریال‌های طبیعی طراحی شده است.</p>
<h3>هایلایت‌های کالکشن</h3>
<ul>
<li>هودی‌های ضخیم با طرح‌های انحصاری</li>
<li>شلوارهای کارگو با جیب‌های کاربردی</li>
<li>کتانی‌های جدید با رنگ‌های پاییزی</li>
</ul>
<p>تمامی محصولات این کالکشن از بهترین متریال‌ها و با دقت بالا تولید شده‌اند.</p>`,
    tag: 'کالکشن',
    readTime: '۳ دقیقه',
    isPublished: true,
    publishedAt: new Date()
  }
];

const pages = [
  {
    title: 'درباره ما',
    slug: 'about',
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
</ul>
<h3>تیم ما</h3>
<p>تیم TM-BRAND متشکل از طراحان با تجربه، متخصصان تولید و تیم پشتیبانی حرفه‌ای است که همگی با هدف ارائه بهترین تجربه خرید برای شما تلاش می‌کنند.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'درباره ما | TM-BRAND',
    metaDescription: 'با TM-BRAND آشنا شوید - برند پوشاک استریت‌ویر ایرانی با کیفیت بالا و طراحی منحصر به فرد'
  },
  {
    title: 'تماس با ما',
    slug: 'contact',
    excerpt: 'راه‌های ارتباط با TM-BRAND',
    content: `<h2>با ما در تماس باشید</h2>
<p>سوالی دارید؟ ما اینجاییم تا کمکتان کنیم. از طریق راه‌های زیر می‌توانید با ما در ارتباط باشید.</p>
<h3>اطلاعات تماس</h3>
<ul>
<li><strong>ایمیل:</strong> info@tm-brand.com</li>
<li><strong>تلفن:</strong> ۰۲۱-۱۲۳۴۵۶۷۸</li>
<li><strong>واتس‌اپ:</strong> ۰۹۱۲۱۲۳۴۵۶۷</li>
</ul>
<h3>آدرس فروشگاه</h3>
<p>تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۳</p>
<h3>ساعات کاری</h3>
<p>شنبه تا پنج‌شنبه: ۹ صبح تا ۶ عصر</p>
<p>جمعه‌ها: تعطیل</p>
<h3>شبکه‌های اجتماعی</h3>
<p>ما را در اینستاگرام دنبال کنید: @tm_brand</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'تماس با ما | TM-BRAND',
    metaDescription: 'با TM-BRAND تماس بگیرید - پشتیبانی، سفارشات و سوالات'
  },
  {
    title: 'سوالات متداول',
    slug: 'faq',
    excerpt: 'پاسخ به سوالات رایج مشتریان',
    content: `<h2>سوالات متداول</h2>

<h3>ارسال و تحویل</h3>
<p><strong>زمان ارسال چقدر است؟</strong></p>
<p>سفارشات معمولاً ظرف ۲ تا ۵ روز کاری ارسال می‌شوند. برای تهران ۱ تا ۲ روز و برای شهرستان‌ها ۳ تا ۵ روز کاری.</p>

<p><strong>هزینه ارسال چقدر است؟</strong></p>
<p>برای سفارش‌های بالای ۲ میلیون تومان، ارسال رایگان است. برای سفارش‌های کمتر، هزینه ارسال بین ۵۰ تا ۱۰۰ هزار تومان است.</p>

<h3>تعویض و مرجوعی</h3>
<p><strong>آیا امکان تعویض وجود دارد؟</strong></p>
<p>بله، تا ۷ روز پس از دریافت می‌توانید محصول را با سایز یا رنگ دیگر تعویض کنید. محصول باید بدون استفاده و با برچسب باشد.</p>

<p><strong>شرایط مرجوعی چیست؟</strong></p>
<p>در صورت عدم رضایت، تا ۷ روز می‌توانید محصول را مرجوع کنید. مبلغ ظرف ۳ روز کاری به حساب شما واریز می‌شود.</p>

<h3>پرداخت</h3>
<p><strong>چه روش‌های پرداختی پشتیبانی می‌شود؟</strong></p>
<p>درگاه بانکی آنلاین، کارت به کارت و پرداخت در محل (فقط تهران).</p>

<h3>سایز و اندازه</h3>
<p><strong>چطور سایز مناسب را انتخاب کنم؟</strong></p>
<p>راهنمای سایز در صفحه هر محصول موجود است. در صورت تردید، یک سایز بزرگتر سفارش دهید.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'سوالات متداول | TM-BRAND',
    metaDescription: 'پاسخ به سوالات متداول درباره خرید، ارسال و مرجوعی محصولات TM-BRAND'
  },
  {
    title: 'قوانین و مقررات',
    slug: 'terms',
    excerpt: 'شرایط و قوانین استفاده از خدمات TM-BRAND',
    content: `<h2>قوانین و مقررات</h2>
<p>با خرید از فروشگاه TM-BRAND، شما شرایط زیر را می‌پذیرید:</p>

<h3>شرایط خرید</h3>
<ul>
<li>تمامی قیمت‌ها به تومان و شامل مالیات بر ارزش افزوده هستند.</li>
<li>قیمت‌ها ممکن است بدون اطلاع قبلی تغییر کنند.</li>
<li>موجودی محصولات محدود است و به ترتیب سفارش ارسال می‌شوند.</li>
</ul>

<h3>مالکیت فکری</h3>
<p>تمامی طرح‌ها، لوگوها و محتوای سایت متعلق به TM-BRAND است و هرگونه کپی‌برداری غیرمجاز پیگرد قانونی دارد.</p>

<h3>محدودیت مسئولیت</h3>
<p>TM-BRAND تلاش می‌کند اطلاعات دقیقی از محصولات ارائه دهد، اما ممکن است تفاوت‌های جزئی در رنگ یا جزئیات وجود داشته باشد.</p>

<h3>حل اختلاف</h3>
<p>در صورت بروز هرگونه اختلاف، طرفین متعهد به حل و فصل از طریق مذاکره هستند.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'قوانین و مقررات | TM-BRAND',
    metaDescription: 'شرایط استفاده و قوانین فروشگاه TM-BRAND'
  },
  {
    title: 'حریم خصوصی',
    slug: 'privacy',
    excerpt: 'سیاست حفظ حریم خصوصی کاربران',
    content: `<h2>سیاست حفظ حریم خصوصی</h2>
<p>حفظ حریم خصوصی شما برای ما بسیار مهم است. این صفحه نحوه جمع‌آوری و استفاده از اطلاعات شما را توضیح می‌دهد.</p>

<h3>اطلاعات جمع‌آوری شده</h3>
<ul>
<li>نام و نام خانوادگی</li>
<li>آدرس ایمیل و شماره تماس</li>
<li>آدرس پستی برای ارسال سفارش</li>
<li>اطلاعات پرداخت (به صورت امن پردازش می‌شود)</li>
</ul>

<h3>استفاده از اطلاعات</h3>
<p>اطلاعات شما فقط برای موارد زیر استفاده می‌شود:</p>
<ul>
<li>پردازش و ارسال سفارشات</li>
<li>ارتباط با شما در مورد سفارش</li>
<li>ارسال خبرنامه (در صورت ثبت‌نام)</li>
<li>بهبود خدمات و تجربه کاربری</li>
</ul>

<h3>امنیت اطلاعات</h3>
<p>ما از پروتکل‌های امنیتی استاندارد برای حفاظت از اطلاعات شما استفاده می‌کنیم.</p>

<h3>اشتراک‌گذاری اطلاعات</h3>
<p>اطلاعات شخصی شما به هیچ شخص ثالثی فروخته یا اجاره داده نمی‌شود، مگر برای ارسال سفارش به شرکت‌های حمل و نقل.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'حریم خصوصی | TM-BRAND',
    metaDescription: 'سیاست حفظ حریم خصوصی و امنیت اطلاعات کاربران در TM-BRAND'
  },
  {
    title: 'راهنمای ارسال',
    slug: 'shipping',
    excerpt: 'اطلاعات کامل درباره روش‌های ارسال و هزینه‌ها',
    content: `<h2>راهنمای ارسال</h2>
<p>TM-BRAND محصولات را به تمام نقاط ایران ارسال می‌کند.</p>

<h3>روش‌های ارسال</h3>
<ul>
<li><strong>پست پیشتاز:</strong> ۲ تا ۵ روز کاری</li>
<li><strong>تیپاکس:</strong> ۱ تا ۳ روز کاری</li>
<li><strong>پیک موتوری (تهران):</strong> همان روز</li>
</ul>

<h3>هزینه ارسال</h3>
<table>
<tr><th>مبلغ سفارش</th><th>هزینه ارسال</th></tr>
<tr><td>بالای ۲,۰۰۰,۰۰۰ تومان</td><td>رایگان</td></tr>
<tr><td>۱,۰۰۰,۰۰۰ تا ۲,۰۰۰,۰۰۰ تومان</td><td>۵۰,۰۰۰ تومان</td></tr>
<tr><td>زیر ۱,۰۰۰,۰۰۰ تومان</td><td>۱۰۰,۰۰۰ تومان</td></tr>
</table>

<h3>پیگیری سفارش</h3>
<p>پس از ارسال، کد پیگیری از طریق پیامک برای شما ارسال می‌شود.</p>

<h3>مناطق تحت پوشش</h3>
<p>ارسال به تمام استان‌ها و شهرهای ایران انجام می‌شود.</p>`,
    status: 'published',
    publishedAt: new Date(),
    metaTitle: 'راهنمای ارسال | TM-BRAND',
    metaDescription: 'اطلاعات کامل درباره روش‌های ارسال، هزینه‌ها و زمان تحویل محصولات TM-BRAND'
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
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123456!', 10);
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
    console.log(`🔑 Admin password: ${process.env.ADMIN_PASSWORD || 'Admin123456!'}`);
    console.log('\n📂 Created:');
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${blogPosts.length} blog posts`);
    console.log(`   - ${pages.length} pages`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seed();
