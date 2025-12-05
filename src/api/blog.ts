import { BlogPost } from '@/types';
import { strapiClient } from './strapi';

// Flag to use Strapi or local data
const USE_STRAPI = import.meta.env.VITE_USE_STRAPI === 'true';

// Local blog posts (fallback)
const localBlogPosts: BlogPost[] = [
  {
    id: '1',
    slug: 'hoodie-winter-guide',
    title: 'راهنمای انتخاب هودی زمستانی TM-BRAND',
    excerpt: 'چطور هودی مناسب استایل زمستانی خودت را انتخاب کنی تا هم گرم بمانی هم استایلت خفن باشد؟',
    content: [
      'هودی یکی از آیتم‌های اصلی استایل خیابانی است؛ مخصوصاً در پاییز و زمستان. اگر قرار است هر روز از یک هودی استفاده کنی، انتخاب جنس و تن‌خور درست خیلی مهم است.',
      'در TM-BRAND ما تمرکزمان روی پارچه‌های نرم، گرم و مقاوم است که بعد از چند بار شست‌وشو، خراب نشوند. اگر به استایل مینیمال علاقه داری، هودی‌های مشکی، طوسی و خاکی بهترین انتخاب هستند.',
      'برای استایل جسورتر، می‌توانی از رنگ‌های خاص‌تر استفاده کنی؛ به شرطی که شلوار و کتانی را ساده انتخاب کنی تا استایل شلوغ نشود.',
      'در نهایت، سعی کن هودی را نه خیلی تنگ بگیری نه بیش از حد اورسایز؛ دو انگشت فضای اضافه در عرض شانه، معمولاً اندازه‌ی مناسبی برای استایل روزمره است.',
    ],
    tags: ['استایل زمستانی'],
    publishedAt: '۱۴ دی ۱۴۰۳',
    readTimeMinutes: 4,
  },
  {
    id: '2',
    slug: 'cargo-pants-styling',
    title: '۳ روش ساده برای ست کردن شلوار کارگو',
    excerpt: 'اگر کارگو دوست داری اما نمی‌دانی با چی ستش کنی، این مقاله مخصوص توست.',
    content: [
      'شلوار کارگو یکی از پرطرفدارترین آیتم‌های استریت‌ویر است. با جیب‌های بزرگ و فرم راحتش، هم کاربردی است هم استایلی.',
      'روش اول: با هودی اورسایز. این ترکیب کلاسیک استریت‌ویر است. یک هودی ساده با کارگو و کتانی سفید، تمام!',
      'روش دوم: با تیشرت فیت و کتانی حجیم. اگر می‌خواهی بالاتنه‌ات ساده‌تر باشد، یک تیشرت ساده با کارگو و یک کتانی chunky عالی می‌شود.',
      'روش سوم: لایه‌بندی با ژاکت. برای روزهای سردتر، یک ژاکت یا بمبر روی تیشرت بپوش و با کارگو ست کن.',
    ],
    tags: ['استایل روزمره'],
    publishedAt: '۲۰ دی ۱۴۰۳',
    readTimeMinutes: 3,
  },
  {
    id: '3',
    slug: 'hoodie-care-tips',
    title: 'چند روش برای مراقبت از هودی و تیشرت‌های پنبه‌ای',
    excerpt: 'با این نکات ساده، لباس‌هایت همیشه تازه و با کیفیت می‌مانند.',
    content: [
      'لباس‌های پنبه‌ای اگر درست نگهداری نشوند، زود رنگشان می‌پرد یا فرمشان خراب می‌شود.',
      'نکته اول: همیشه لباس را برعکس (از داخل) بشور. این کار از رنگ‌پریدگی جلوگیری می‌کند.',
      'نکته دوم: از آب سرد یا ولرم استفاده کن. آب داغ باعث جمع شدن پارچه می‌شود.',
      'نکته سوم: لباس‌ها را در سایه خشک کن. نور مستقیم آفتاب رنگ را می‌پراند.',
      'نکته چهارم: هودی‌ها را تا نزن، آویزان کن. این کار از چروک شدن جلوگیری می‌کند.',
    ],
    tags: ['نگهداری لباس'],
    publishedAt: '۲۵ دی ۱۴۰۳',
    readTimeMinutes: 2,
  },
];

/**
 * Transform Strapi blog post to our BlogPost type
 */
const transformStrapiBlogPost = (item: any): BlogPost => {
  const attrs = item.attributes;
  
  // Handle content - can be string or array
  let content: string[];
  if (Array.isArray(attrs.content)) {
    content = attrs.content;
  } else if (typeof attrs.content === 'string') {
    content = attrs.content.split('\n\n').filter(Boolean);
  } else {
    content = [];
  }

  return {
    id: item.id.toString(),
    slug: attrs.slug,
    title: attrs.title,
    excerpt: attrs.excerpt || '',
    content,
    tags: attrs.tags || [],
    publishedAt: attrs.publishedAt || '',
    readTimeMinutes: attrs.readTimeMinutes || 3,
  };
};

/**
 * Get all blog posts
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  if (!USE_STRAPI) {
    return localBlogPosts;
  }

  try {
    const data = await strapiClient.get<any[]>('/blog-posts?populate=*&sort=createdAt:desc');
    return data.map(transformStrapiBlogPost);
  } catch (error) {
    console.error('Failed to fetch blog posts from Strapi, using local data:', error);
    return localBlogPosts;
  }
};

/**
 * Get single blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  if (!USE_STRAPI) {
    return localBlogPosts.find(post => post.slug === slug);
  }

  try {
    const data = await strapiClient.get<any[]>(
      `/blog-posts?filters[slug][$eq]=${slug}&populate=*`
    );
    return data[0] ? transformStrapiBlogPost(data[0]) : undefined;
  } catch (error) {
    console.error('Failed to fetch blog post from Strapi, using local data:', error);
    return localBlogPosts.find(post => post.slug === slug);
  }
};
