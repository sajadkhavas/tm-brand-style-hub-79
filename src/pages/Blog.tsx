import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, Sparkles } from 'lucide-react';
import { getBlogPosts } from '@/api/blog';

const Blog = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: getBlogPosts
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background" dir="rtl">
        <section className="pt-28 pb-16 border-b border-border/40">
          <div className="container mx-auto px-4">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-12 w-96 mb-3" />
            <Skeleton className="h-6 w-2/3" />
          </div>
        </section>
        <section className="py-10">
          <div className="container mx-auto px-4 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Hero Section */}
      <section className="pt-28 pb-16 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/30">
            <Sparkles className="h-4 w-4 ml-2" />
            وبلاگ TM-BRAND
          </Badge>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            نکته‌های استریت‌ویر و استایل روزمره
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            اینجا مقاله‌ها و نکته‌هایی را می‌گذاریم که کمک کند از لباس‌هایی
            که می‌خری، حداکثر استفاده را ببری.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {posts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <Card
                  key={post.id}
                  className="border-border/50 bg-card/80 backdrop-blur-xl hover:border-primary/60 hover:-translate-y-1 transition-all duration-300 opacity-0 animate-fade-up"
                  style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
                >
                  <CardContent className="p-6 flex flex-col gap-4">
                    {/* Meta Info */}
                    <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="w-4 h-4" />
                        {post.publishedAt}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTimeMinutes} دقیقه
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-bold text-foreground">
                      <Link
                        to={`/blog/${post.slug}`}
                        className="hover:text-primary transition-colors duration-200 focus-visible:outline-none focus-visible:text-primary"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
                      {post.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="pt-4 border-t border-border/40 flex items-center justify-between">
                      <div className="flex gap-2">
                        {post.tags?.slice(0, 2).map((tag, i) => (
                          <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
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
          ) : (
            <div className="text-center py-24" dir="rtl">
              <div className="w-24 h-24 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
                <Sparkles className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">مقاله‌ای یافت نشد</h3>
              <p className="text-muted-foreground text-lg">
                به زودی مقالات جدید اضافه خواهند شد
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Blog;
