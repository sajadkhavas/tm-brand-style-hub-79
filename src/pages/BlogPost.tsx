import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, ArrowRight } from 'lucide-react';
import { getBlogPostBySlug } from '@/api/blog';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => getBlogPostBySlug(slug || ''),
    enabled: Boolean(slug),
  });

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background" dir="rtl">
        <div className="space-y-2 text-center">
          <div className="mx-auto h-10 w-10 rounded-full bg-primary/10 animate-pulse" />
          <p className="text-muted-foreground">در حال بارگذاری مقاله...</p>
        </div>
      </main>
    );
  }

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
              {post.publishedAt}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTimeMinutes} دقیقه
            </span>
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] font-medium">
              {post.tags?.[0]}
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
