import { useParams, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';

const posts: Record<string, {
  title: string;
  date: string;
  readTime: string;
  tag: string;
  content: string[];
}> = {
  'hoodie-winter-guide': {
    title: 'راهنمای انتخاب هودی زمستانی TM-BRAND',
    date: '۱۴ دی ۱۴۰۳',
    readTime: '۴ دقیقه',
    tag: 'استایل زمستانی',
    content: [
      'هودی یکی از آیتم‌های اصلی استایل خیابانی است؛ مخصوصاً در پاییز و زمستان. اگر قرار است هر روز از یک هودی استفاده کنی، انتخاب جنس و تن‌خور درست خیلی مهم است.',
      'در TM-BRAND ما تمرکزمان روی پارچه‌های نرم، گرم و مقاوم است که بعد از چند بار شست‌وشو، خراب نشوند. اگر به استایل مینیمال علاقه داری، هودی‌های مشکی، طوسی و خاکی بهترین انتخاب هستند.',
      'برای استایل جسورتر، می‌توانی از رنگ‌های خاص‌تر استفاده کنی؛ به شرطی که شلوار و کتانی را ساده انتخاب کنی تا استایل شلوغ نشود.',
      'در نهایت، سعی کن هودی را نه خیلی تنگ بگیری نه بیش از حد اورسایز؛ دو انگشت فضای اضافه در عرض شانه، معمولاً اندازه‌ی مناسبی برای استایل روزمره است.',
    ],
  },
  'cargo-pants-styling': {
    title: '۳ روش ساده برای ست کردن شلوار کارگو',
    date: '۲۰ دی ۱۴۰۳',
    readTime: '۳ دقیقه',
    tag: 'استایل روزمره',
    content: [
      'شلوار کارگو یکی از پرطرفدارترین آیتم‌های استریت‌ویر است. با جیب‌های بزرگ و فرم راحتش، هم کاربردی است هم استایلی.',
      'روش اول: با هودی اورسایز. این ترکیب کلاسیک استریت‌ویر است. یک هودی ساده با کارگو و کتانی سفید، تمام!',
      'روش دوم: با تیشرت فیت و کتانی حجیم. اگر می‌خواهی بالاتنه‌ات ساده‌تر باشد، یک تیشرت ساده با کارگو و یک کتانی chunky عالی می‌شود.',
      'روش سوم: لایه‌بندی با ژاکت. برای روزهای سردتر، یک ژاکت یا بمبر روی تیشرت بپوش و با کارگو ست کن.',
    ],
  },
  'hoodie-care-tips': {
    title: 'چند روش برای مراقبت از هودی و تیشرت‌های پنبه‌ای',
    date: '۲۵ دی ۱۴۰۳',
    readTime: '۲ دقیقه',
    tag: 'نگهداری لباس',
    content: [
      'لباس‌های پنبه‌ای اگر درست نگهداری نشوند، زود رنگشان می‌پرد یا فرمشان خراب می‌شود.',
      'نکته اول: همیشه لباس را برعکس (از داخل) بشور. این کار از رنگ‌پریدگی جلوگیری می‌کند.',
      'نکته دوم: از آب سرد یا ولرم استفاده کن. آب داغ باعث جمع شدن پارچه می‌شود.',
      'نکته سوم: لباس‌ها را در سایه خشک کن. نور مستقیم آفتاب رنگ را می‌پراند.',
      'نکته چهارم: هودی‌ها را تا نزن، آویزان کن. این کار از چروک شدن جلوگیری می‌کند.',
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? posts[slug] : null;

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center space-y-4">
          <p className="text-xl font-semibold text-foreground">مقاله پیدا نشد</p>
          <Link to="/blog" className="text-primary text-sm hover:text-primary/80">
            بازگشت به وبلاگ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <section className="pt-28 pb-10 border-b border-border/40">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge className="mb-4 px-4 py-1.5 flex items-center gap-1 w-fit">
            <Link to="/blog" className="flex items-center gap-1 text-xs">
              <ArrowRight className="w-3 h-3" />
              بازگشت به وبلاگ
            </Link>
          </Badge>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-6">
            <span className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              {post.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
              {post.tag}
            </span>
          </div>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-3xl leading-relaxed space-y-4 text-muted-foreground">
          {post.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
