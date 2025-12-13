import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CalendarDays, Clock, ArrowRight, Share2 } from 'lucide-react';
import { getBlogPostBySlug } from '@/api/blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: post, isLoading, error } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getBlogPostBySlug(slug || ''),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background" dir="rtl">
        <section className="pt-28 pb-10 border-b border-border/40">
          <div className="container mx-auto px-4 max-w-3xl">
            <Skeleton className="h-6 w-32 mb-4" />
            <Skeleton className="h-12 w-full mb-4" />
            <div className="flex gap-4 mb-6">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </section>
        <section className="py-10">
          <div className="container mx-auto px-4 max-w-3xl space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto">
            <ArrowRight className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">مقاله پیدا نشد</h1>
            <p className="text-muted-foreground mb-6">متأسفانه مقاله مورد نظر شما یافت نشد</p>
          </div>
          <Button asChild>
            <Link to="/blog">بازگشت به وبلاگ</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <section className="pt-28 pb-10 border-b border-border/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          {/* Back Link */}
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
          >
            <ArrowRight className="w-4 h-4" />
            بازگشت به وبلاگ
          </Link>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {post.readTimeMinutes} دقیقه مطالعه
            </span>
            {post.tags?.map((tag, i) => (
              <Badge key={i} variant="secondary" className="bg-primary/10 text-primary border-primary/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <article className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
            {post.content.map((paragraph, idx) => {
              // Check if paragraph contains HTML
              if (paragraph.includes('<')) {
                return (
                  <div 
                    key={idx} 
                    dangerouslySetInnerHTML={{ __html: paragraph }}
                  />
                );
              }
              return (
                <p key={idx} className="leading-relaxed mb-6">
                  {paragraph}
                </p>
              );
            })}
          </article>

          {/* Share & Navigation */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <div className="flex items-center justify-between">
              <Button variant="outline" asChild className="gap-2">
                <Link to="/blog">
                  <ArrowRight className="w-4 h-4" />
                  مقالات بیشتر
                </Link>
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BlogPost;
