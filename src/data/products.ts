import hoodieBlack from '@/assets/products/hoodie-black.png';
import tshirtWhite from '@/assets/products/tshirt-white.png';
import pantsCargo from '@/assets/products/pants-cargo.png';
import jeansSlim from '@/assets/products/jeans-slim.png';
import sneakersNeon from '@/assets/products/sneakers-neon.png';
import capBlack from '@/assets/products/cap-black.png';

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  category: string;
  subcategory?: string;
  gender: 'men' | 'women' | 'unisex';
  price: number;
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  description: string;
  longDescription?: string;
  features?: string[];
  specifications?: Array<{ label: string; value: string }>;
  sizeGuide?: string;
  materials?: string;
  images: string[];
  isNew?: boolean;
  isBestSeller?: boolean;
  isOnSale?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export const products: Product[] = [
  // Hoodies & Sweatshirts
  {
    id: '1',
    slug: 'tm-signature-hoodie',
    name: 'هودی اسپرت TM-BRAND',
    nameEn: 'TM-BRAND Signature Hoodie',
    category: 'hoodies',
    gender: 'men',
    price: 1850000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'سفید', hex: '#FFFFFF' },
      { name: 'نیون سبز', hex: '#BFFF00' }
    ],
    description: 'هودی اسپرت با طراحی مدرن و لوگوی TM-BRAND',
    images: [hoodieBlack],
    isNew: true,
    isBestSeller: true
  },
  {
    id: '2',
    slug: 'oversized-streetwear-hoodie',
    name: 'هودی اورسایز استریت',
    nameEn: 'Oversized Streetwear Hoodie',
    category: 'hoodies',
    gender: 'men',
    price: 2150000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'خاکستری', hex: '#808080' },
      { name: 'مشکی', hex: '#000000' }
    ],
    description: 'هودی اورسایز با فیت راحت برای استایل استریت',
    images: [hoodieBlack],
    isNew: true
  },
  {
    id: '3',
    slug: 'zip-up-sport-hoodie',
    name: 'سویشرت زیپ‌دار اسپرت',
    nameEn: 'Zip-Up Sport Hoodie',
    category: 'hoodies',
    gender: 'men',
    price: 1650000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'سرمه‌ای', hex: '#000080' },
      { name: 'مشکی', hex: '#000000' }
    ],
    description: 'سویشرت زیپ‌دار با جنس عالی و دوام بالا',
    images: [hoodieBlack],
    isBestSeller: true
  },

  // T-Shirts & Tops
  {
    id: '4',
    slug: 'tm-logo-tee',
    name: 'تیشرت لوگو TM-BRAND',
    nameEn: 'TM-BRAND Logo Tee',
    category: 'tshirts',
    gender: 'men',
    price: 550000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'سفید', hex: '#FFFFFF' },
      { name: 'نیون سبز', hex: '#BFFF00' }
    ],
    description: 'تیشرت کلاسیک با لوگوی TM-BRAND',
    images: [tshirtWhite],
    isBestSeller: true
  },
  {
    id: '5',
    slug: 'oversized-graphic-tee',
    name: 'تیشرت اورسایز گرافیکی',
    nameEn: 'Oversized Graphic Tee',
    category: 'tshirts',
    gender: 'men',
    price: 680000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'خاکستری', hex: '#808080' }
    ],
    description: 'تیشرت اورسایز با طراحی گرافیکی منحصر به فرد',
    images: [tshirtWhite],
    isNew: true
  },
  {
    id: '6',
    slug: 'basic-cotton-tee',
    name: 'تیشرت پنبه‌ای ساده',
    nameEn: 'Basic Cotton Tee',
    category: 'tshirts',
    gender: 'men',
    price: 420000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'سفید', hex: '#FFFFFF' },
      { name: 'مشکی', hex: '#000000' },
      { name: 'خاکستری', hex: '#808080' }
    ],
    description: 'تیشرت پنبه‌ای با کیفیت عالی',
    images: [tshirtWhite]
  },
  {
    id: '7',
    slug: 'striped-longsleeve',
    name: 'تیشرت آستین بلند راه‌راه',
    nameEn: 'Striped Long Sleeve',
    category: 'tshirts',
    gender: 'men',
    price: 720000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'مشکی-سفید', hex: '#000000' },
      { name: 'سرمه‌ای-سفید', hex: '#000080' }
    ],
    description: 'تیشرت آستین بلند با طرح راه‌راه',
    images: [tshirtWhite]
  },

  // Pants & Joggers
  {
    id: '8',
    slug: 'cargo-joggers',
    name: 'شلوار جاگر کارگو',
    nameEn: 'Cargo Joggers',
    category: 'pants',
    gender: 'men',
    price: 1350000,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'خاکی', hex: '#8B7355' },
      { name: 'خاکستری', hex: '#808080' }
    ],
    description: 'شلوار جاگر کارگو با جیب‌های متعدد',
    images: [pantsCargo],
    isBestSeller: true
  },
  {
    id: '9',
    slug: 'tech-joggers',
    name: 'شلوار اسپرت تکنولوژی',
    nameEn: 'Tech Joggers',
    category: 'pants',
    gender: 'men',
    price: 1180000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'سرمه‌ای', hex: '#000080' }
    ],
    description: 'شلوار اسپرت با پارچه تکنولوژی',
    images: [pantsCargo],
    isNew: true
  },
  {
    id: '10',
    slug: 'wide-fit-pants',
    name: 'شلوار واید فیت',
    nameEn: 'Wide Fit Pants',
    category: 'pants',
    gender: 'men',
    price: 1420000,
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'بژ', hex: '#F5F5DC' }
    ],
    description: 'شلوار واید فیت با استایل مدرن',
    images: [pantsCargo]
  },

  // Jeans
  {
    id: '11',
    slug: 'slim-fit-jeans',
    name: 'شلوار جین اسلیم فیت',
    nameEn: 'Slim Fit Jeans',
    category: 'jeans',
    gender: 'men',
    price: 1580000,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'آبی تیره', hex: '#1E3A5F' },
      { name: 'مشکی', hex: '#000000' }
    ],
    description: 'شلوار جین اسلیم فیت با فیت عالی',
    images: [jeansSlim],
    isBestSeller: true
  },
  {
    id: '12',
    slug: 'relaxed-fit-jeans',
    name: 'شلوار جین ریلکسد فیت',
    nameEn: 'Relaxed Fit Jeans',
    category: 'jeans',
    gender: 'men',
    price: 1650000,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'آبی روشن', hex: '#4682B4' },
      { name: 'آبی تیره', hex: '#1E3A5F' }
    ],
    description: 'شلوار جین ریلکسد فیت راحت',
    images: [jeansSlim]
  },
  {
    id: '13',
    slug: 'ripped-jeans',
    name: 'شلوار جین پاره',
    nameEn: 'Ripped Jeans',
    category: 'jeans',
    gender: 'men',
    price: 1720000,
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'آبی روشن', hex: '#4682B4' },
      { name: 'مشکی', hex: '#000000' }
    ],
    description: 'شلوار جین پاره با استایل استریت',
    images: [jeansSlim],
    isNew: true
  },

  // Sneakers & Sport Shoes
  {
    id: '14',
    slug: 'tm-sport-sneakers',
    name: 'کفش اسپرت TM-BRAND',
    nameEn: 'TM-BRAND Sport Sneakers',
    category: 'shoes',
    gender: 'men',
    price: 2850000,
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'مشکی-نیون', hex: '#000000' },
      { name: 'سفید-نیون', hex: '#FFFFFF' }
    ],
    description: 'کفش اسپرت با طراحی TM-BRAND و راحتی بالا',
    images: [sneakersNeon],
    isNew: true,
    isBestSeller: true
  },
  {
    id: '15',
    slug: 'running-sneakers',
    name: 'کفش اسپرت دویدن',
    nameEn: 'Running Sneakers',
    category: 'shoes',
    gender: 'men',
    price: 3200000,
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'خاکستری', hex: '#808080' },
      { name: 'مشکی', hex: '#000000' }
    ],
    description: 'کفش دویدن با تکنولوژی پیشرفته',
    images: [sneakersNeon]
  },
  {
    id: '16',
    slug: 'casual-sneakers',
    name: 'کفش کژوال',
    nameEn: 'Casual Sneakers',
    category: 'shoes',
    gender: 'men',
    price: 2450000,
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'سفید', hex: '#FFFFFF' },
      { name: 'مشکی', hex: '#000000' },
      { name: 'بژ', hex: '#F5F5DC' }
    ],
    description: 'کفش کژوال برای استفاده روزانه',
    images: [sneakersNeon],
    isBestSeller: true
  },
  {
    id: '17',
    slug: 'high-top-sneakers',
    name: 'کفش نیم‌بوت اسپرت',
    nameEn: 'High-Top Sneakers',
    category: 'shoes',
    gender: 'men',
    price: 2950000,
    sizes: ['39', '40', '41', '42', '43', '44'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'سفید-مشکی', hex: '#FFFFFF' }
    ],
    description: 'کفش نیم‌بوت با استایل استریت',
    images: [sneakersNeon]
  },

  // Accessories
  {
    id: '18',
    slug: 'tm-cap',
    name: 'کلاه کپ TM-BRAND',
    nameEn: 'TM-BRAND Cap',
    category: 'accessories',
    gender: 'men',
    price: 380000,
    sizes: ['One Size'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'سفید', hex: '#FFFFFF' },
      { name: 'نیون سبز', hex: '#BFFF00' }
    ],
    description: 'کلاه کپ با لوگوی TM-BRAND',
    images: [capBlack],
    isBestSeller: true
  },
  {
    id: '19',
    slug: 'sport-socks-pack',
    name: 'پک جوراب اسپرت',
    nameEn: 'Sport Socks Pack',
    category: 'accessories',
    gender: 'men',
    price: 250000,
    sizes: ['39-42', '43-46'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'سفید', hex: '#FFFFFF' }
    ],
    description: 'پک ۳ عددی جوراب اسپرت',
    images: [capBlack]
  },
  {
    id: '20',
    slug: 'leather-belt',
    name: 'کمربند چرم',
    nameEn: 'Leather Belt',
    category: 'accessories',
    gender: 'men',
    price: 580000,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'قهوه‌ای', hex: '#8B4513' }
    ],
    description: 'کمربند چرم با کیفیت عالی',
    images: [capBlack]
  },
  {
    id: '21',
    slug: 'crossbody-bag',
    name: 'کیف دوشی اسپرت',
    nameEn: 'Crossbody Bag',
    category: 'accessories',
    gender: 'men',
    price: 890000,
    sizes: ['One Size'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'خاکستری', hex: '#808080' }
    ],
    description: 'کیف دوشی با طراحی مدرن',
    images: [capBlack],
    isNew: true
  },
  {
    id: '22',
    slug: 'beanie-hat',
    name: 'کلاه بافت',
    nameEn: 'Beanie Hat',
    category: 'accessories',
    gender: 'men',
    price: 420000,
    sizes: ['One Size'],
    colors: [
      { name: 'مشکی', hex: '#000000' },
      { name: 'خاکستری', hex: '#808080' },
      { name: 'نیون سبز', hex: '#BFFF00' }
    ],
    description: 'کلاه بافتنی برای فصل سرد',
    images: [capBlack]
  },
  // Air Jordan 1 Retro High - Premium Basketball Sneaker
  {
    id: '23',
    slug: 'air-jordan-1-retro-high-bred-toe',
    name: 'کفش بسکتبال ایرجردن ۱ رترو های – برد تو',
    nameEn: 'Air Jordan 1 Retro High - Bred Toe',
    category: 'shoes',
    subcategory: 'basketball',
    gender: 'unisex',
    price: 12500000,
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45', '46'],
    colors: [
      { name: 'مشکی-قرمز-سفید', hex: '#000000' },
      { name: 'سفید-قرمز', hex: '#DC143C' },
      { name: 'سیاه-سفید', hex: '#1a1a1a' }
    ],
    materials: '۱۰۰٪ چرم طبیعی، زیره لاستیکی Air-Sole، داخل پارچه‌ای نرم',
    description: 'کفش بسکتبال ایرجردن ۱ رترو – طراحی اصیل ۱۹۸۵ با تکنولوژی Air برای راحتی و سبک مطلق',
    longDescription: `کفش ایرجردن ۱ رترو های یکی از نمادین‌ترین و محبوب‌ترین کفش‌های ورزشی تاریخ است که توسط برند Nike در همکاری با اسطوره بسکتبال مایکل جردن طراحی شده است.

این کفش برای علاقه‌مندان به فرهنگ استریت‌ویر، بسکتبال و کالکشنرهای کفش طراحی شده و ترکیبی بی‌نظیر از استایل کلاسیک و عملکرد مدرن را ارائه می‌دهد.

**مزایای کلیدی:**
- طراحی تایم‌لس و کلاسیک که هرگز از مد نمی‌افتد
- تکنولوژی Air-Sole در پاشنه برای جذب ضربه و راحتی بی‌نظیر
- ساخت تمام چرم طبیعی با دوام بالا و ظاهر پرمیوم
- سبکی استثنایی با حمایت عالی از مچ پا و قوزک

**موارد استفاده:**
این کفش برای طیف وسیعی از کاربردها مناسب است: بازی بسکتبال، پیاده‌روی روزانه، استایل استریت‌ویر، رویدادهای اجتماعی و حتی کالکشن شخصی. ترکیب رنگ برد تو (مشکی-قرمز-سفید) یکی از خواسته‌ترین رنگ‌بندی‌های این مدل است.

**چرا ایرجردن ۱؟**
ایرجردن ۱ نه تنها یک کفش است، بلکه نمادی از فرهنگ پاپ، تاریخ بسکتبال و سبک زندگی آزاد است. این کفش تاریخچه‌ای ۳۸ ساله دارد و هنوز هم جزء پرفروش‌ترین و پرطرفدارترین کفش‌های دنیا محسوب می‌شود.`,
    features: [
      'طراحی کلاسیک و آیکونیک ایرجردن ۱ از سال ۱۹۸۵',
      'ساخت تمام چرم طبیعی با کیفیت پرمیوم',
      'تکنولوژی Air-Sole برای جذب ضربه و راحتی',
      'حمایت عالی از مچ پا با طراحی High-Top',
      'زیره لاستیکی با کشش بالا برای بازی و راه رفتن',
      'بندهای مقاوم و قفل کننده قوی',
      'داخل نرم و تنفس‌پذیر',
      'مناسب برای بازی، پیاده‌روی و استایل روزانه'
    ],
    specifications: [
      { label: 'برند', value: 'Nike - Air Jordan' },
      { label: 'مدل', value: 'Air Jordan 1 Retro High' },
      { label: 'رنگ‌بندی', value: 'Bred Toe (مشکی-قرمز-سفید)' },
      { label: 'جنس رویه', value: '۱۰۰٪ چرم طبیعی' },
      { label: 'جنس زیره', value: 'لاستیک با فناوری Air-Sole' },
      { label: 'نوع بسته شدن', value: 'بندکفش استاندارد' },
      { label: 'ارتفاع', value: 'High-Top (نیم‌بوت)' },
      { label: 'مناسب برای', value: 'بسکتبال، استریت‌ویر، روزانه' },
      { label: 'وزن (هر جفت)', value: 'حدود ۷۰۰ گرم' },
      { label: 'کشور سازنده', value: 'ویتنام / چین (اورجینال Nike)' },
      { label: 'گارانتی اصالت', value: '۱۰۰٪ اورجینال با برچسب Nike' }
    ],
    sizeGuide: `**راهنمای انتخاب سایز کفش ایرجردن:**

کفش‌های ایرجردن ۱ معمولاً سایز استاندارد دارند، اما توصیه می‌شود:

- **فیت کلی:** Regular Fit (استاندارد) - نه تنگ، نه گشاد
- **اگر پای شما کمی پهن است:** یک سایز بزرگ‌تر انتخاب کنید
- **اگر بین دو سایز هستید:** سایز بزرگ‌تر را انتخاب کنید
- **برای استفاده روزانه:** سایز معمولی مناسب است
- **برای بازی بسکتبال:** ممکن است یک سایز بزرگ‌تر راحت‌تر باشد

**نکته مهم:** این کفش‌ها طراحی High-Top دارند و مچ پا را می‌پوشانند، بنابراین در ابتدا ممکن است کمی سفت به نظر برسند، اما پس از چند بار استفاده کاملاً جا می‌افتند.`,
    images: [sneakersNeon],
    isNew: true,
    isBestSeller: true,
    seoTitle: 'خرید کفش ایرجردن ۱ رترو | Air Jordan 1 Retro High اورجینال',
    seoDescription: 'کفش ایرجردن ۱ رترو برد تو با تکنولوژی Air-Sole و چرم طبیعی. مناسب بسکتبال و استریت‌ویر. ارسال سریع و گارانتی اصالت ۱۰۰٪',
    seoKeywords: [
      'خرید کفش ایرجردن',
      'Air Jordan 1',
      'کفش بسکتبال',
      'ایرجردن رترو',
      'کفش نایک اورجینال',
      'Jordan 1 Bred Toe',
      'خرید اسنیکر',
      'کفش استریت‌ویر',
      'Air Jordan Iran',
      'کفش ورزشی مردانه',
      'sneakers original',
      'کفش مایکل جردن',
      'خرید کفش اورجینال',
      'کفش هایتاپ',
      'basket shoes'
    ]
  }
];

export const categories = [
  { id: 'hoodies', name: 'هودی و سویشرت', nameEn: 'Hoodies & Sweatshirts', slug: 'hoodies' },
  { id: 'tshirts', name: 'تیشرت', nameEn: 'T-Shirts', slug: 'tshirts' },
  { id: 'pants', name: 'شلوار', nameEn: 'Pants & Joggers', slug: 'pants' },
  { id: 'jeans', name: 'شلوار جین', nameEn: 'Jeans', slug: 'jeans' },
  { id: 'shoes', name: 'کفش', nameEn: 'Sneakers & Shoes', slug: 'shoes' },
  { id: 'accessories', name: 'اکسسوری', nameEn: 'Accessories', slug: 'accessories' }
];
