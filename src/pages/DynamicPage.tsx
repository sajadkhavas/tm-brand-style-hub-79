/**
 * Dynamic CMS Page Component
 * Renders any page from AdminJS Pages resource
 * All static pages (about, contact, terms, privacy, shipping, faq) 
 * are fetched dynamically from the backend API
 */
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { getPageBySlug } from '@/api/pages';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { FileQuestion, ArrowRight } from 'lucide-react';

type DynamicPageProps = {
  defaultSlug?: string;
};

const DynamicPage = ({ defaultSlug }: DynamicPageProps) => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();

  // Get slug from params or from path (for routes like /terms, /privacy)
  const pageSlug = slug || defaultSlug || location.pathname.replace('/', '');
  
  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', pageSlug],
    queryFn: () => getPageBySlug(pageSlug),
    enabled: Boolean(pageSlug),
  });

  const pageTitle = page?.metaTitle || page?.title || 'TM-BRAND';
  const pageDescription = page?.metaDescription || page?.excerpt || '';
  const canonicalUrl = page?.slug && typeof window !== 'undefined'
    ? `${window.location.origin}/page/${page.slug}`
    : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" dir="rtl">
        <div className="container mx-auto px-4 max-w-4xl">
          <Skeleton className="h-12 w-3/4 mb-6" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-full mb-4" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-6 px-4">
          <div className="w-24 h-24 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto">
            <FileQuestion className="h-12 w-12 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">صفحه یافت نشد</h1>
            <p className="text-muted-foreground mb-6">
              متأسفانه صفحه «{pageSlug}» پیدا نشد. ممکن است هنوز در پنل مدیریت ایجاد نشده باشد.
            </p>
          </div>
          <Button asChild>
            <Link to="/" className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4" />
              بازگشت به صفحه اصلی
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Helmet>
        <title>{pageTitle}</title>
        {pageDescription && <meta name="description" content={pageDescription} />}
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
              {page.title}
            </h1>
            {page.excerpt && (
              <p className="text-xl text-muted-foreground leading-relaxed">
                {page.excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Render HTML content from CMS */}
            <div
              className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:text-primary/80 prose-li:text-muted-foreground prose-ul:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: page.content || '' }}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default DynamicPage;
