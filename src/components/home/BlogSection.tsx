import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';
import { getBlogPosts } from '@/api/blog';

export const BlogSection = () => {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['blog-posts-home'],
    queryFn: getBlogPosts,
  });

  const latestPost = posts[0];
  const nextIdeas = posts.slice(1, 4);

  if (isLoading) {
    return (
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-surface/80" />
        <div className="container mx-auto px-4 relative z-10" dir="rtl">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-12 w-96 mb-12" />
          <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
            <Skeleton className="h-96 rounded-2xl" />
            <div className="space-y-4">
              <Skeleton className="h-32 rounded-2xl" />
              <Skeleton className="h-32 rounded-2xl" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-surface/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10" dir="rtl">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <Badge className="mb-4 px-4 py-1.5">وبلاگ TM-BRAND</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              آخرین نکته‌های استایل
            </h2>
            <p className="text-muted-foreground max-w-xl">
              اینجا نکته‌های کوتاه و کاربردی می‌گذاریم تا بهتر از هودی‌ها، شلوارها و اکسسوری‌های TM-BRAND استفاده کنی.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 h-12 px-6 rounded-xl">
            <Link to="/blog">
              مشاهده همه مقالات
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Content + Sidebar */}
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8 items-start">
          {/* Main Article */}
          {latestPost && (
            <Card className="border-border/40 bg-card/80 backdrop-blur-xl hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-6 md:p-8 leading-relaxed space-y-4">
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {latestPost.publishedAt}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {latestPost.readTimeMinutes} دقیقه
                  </span>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  <Link to={`/blog/${latestPost.slug}`} className="hover:text-primary transition-colors">
                    {latestPost.title}
                  </Link>
                </h3>
                
                <p className="text-muted-foreground line-clamp-4">
                  {latestPost.excerpt || latestPost.content[0]}
                </p>

                <div className="pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex gap-2">
                    {latestPost.tags?.slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/blog/${latestPost.slug}`} className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                    ادامه مطلب
                    <ArrowLeft className="h-3 w-3" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sidebar */}
          <div className="space-y-4">
            {nextIdeas.length > 0 && (
              <Card className="border-dashed border-border/50 bg-card/60">
                <CardContent className="p-5 space-y-3 text-sm">
                  <h4 className="font-semibold text-foreground">مقالات بیشتر</h4>
                  <ul className="space-y-3">
                    {nextIdeas.map((post) => (
                      <li key={post.id}>
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="block text-muted-foreground hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            <Card className="border-border/40 bg-card/60">
              <CardContent className="p-5 flex flex-col gap-3 text-sm" dir="rtl">
                <p className="text-muted-foreground">
                  اگر دوست داری در مورد موضوع خاصی در وبلاگ بنویسیم، از طریق فرم تماس یا شبکه‌های اجتماعی به ما پیام بده.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start rounded-xl border-border/60 hover:border-primary/60 hover:bg-primary/5 gap-2"
                >
                  <Link to="/contact">
                    پیشنهاد موضوع وبلاگ
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
