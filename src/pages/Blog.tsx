import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock } from 'lucide-react';

const posts = [
  {
    slug: 'hoodie-winter-guide',
    title: 'راهنمای انتخاب هودی زمستانی TM-BRAND',
    excerpt:
      'چطور هودی مناسب استایل زمستانی خودت را انتخاب کنی تا هم گرم بمانی هم استایلت خفن باشد؟',
    readTime: '۴ دقیقه',
    date: '۱۴ دی ۱۴۰۳',
    tag: 'استایل زمستانی',
  },
  {
    slug: 'cargo-pants-styling',
    title: '۳ روش ساده برای ست کردن شلوار کارگو',
    excerpt:
      'اگر کارگو دوست داری اما نمی‌دانی با چی ستش کنی، این مقاله مخصوص توست.',
    readTime: '۳ دقیقه',
    date: '۲۰ دی ۱۴۰۳',
    tag: 'استایل روزمره',
  },
  {
    slug: 'hoodie-care-tips',
    title: 'چند روش برای مراقبت از هودی و تیشرت‌های پنبه‌ای',
    excerpt:
      'با این نکات ساده، لباس‌هایت همیشه تازه و با کیفیت می‌مانند.',
    readTime: '۲ دقیقه',
    date: '۲۵ دی ۱۴۰۳',
    tag: 'نگهداری لباس',
  },
];

const Blog = () => {
  return (
    <main className="min-h-screen bg-background" dir="rtl">
      <section className="pt-28 pb-16 border-b border-border/40">
        <div className="container mx-auto px-4">
          <Badge className="mb-4 px-4 py-1.5">وبلاگ TM-BRAND</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            نکته‌های استریت‌ویر و استایل روزمره
          </h1>
          <p className="text-muted-foreground max-w-2xl">
            اینجا مقاله‌ها و نکته‌هایی را می‌گذاریم که کمک کند از لباس‌هایی
            که می‌خری، حداکثر استفاده را ببری.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.slug}
              className="border-border/50 bg-card/80 backdrop-blur-xl hover:border-primary/60 hover:-translate-y-1 transition-all duration-300"
            >
              <CardContent className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-foreground">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                    {post.tag}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-xs text-primary hover:text-primary/80 focus-visible:outline-none focus-visible:underline"
                  >
                    ادامه مطلب ←
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Blog;
