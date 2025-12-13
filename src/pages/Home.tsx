import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/product/ProductCard';
import { Hero3DText } from '@/components/home/Hero3DText';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ScrollProgress } from '@/components/animations/ScrollProgress';
import { BlogSection } from '@/components/home/BlogSection';
import { getProducts, getCategories } from '@/api/products';
import { getHomeSettings } from '@/api/settings';
import { CheckCircle2, Truck, RotateCcw, ArrowLeft, Sparkles, Star, Zap, Heart, TrendingUp, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FloatingContactButton } from '@/components/layout/FloatingContactButton';

// Fallback images for categories
import hoodieBlack from '@/assets/products/hoodie-black.png';
import tshirtWhite from '@/assets/products/tshirt-white.png';
import pantsCargo from '@/assets/products/pants-cargo.png';
import jeansSlim from '@/assets/products/jeans-slim.png';
import sneakersNeon from '@/assets/products/sneakers-neon.png';
import capBlack from '@/assets/products/cap-black.png';

const categoryImages: Record<string, string> = {
  hoodies: hoodieBlack,
  tshirts: tshirtWhite,
  pants: pantsCargo,
  jeans: jeansSlim,
  shoes: sneakersNeon,
  accessories: capBlack
};

const defaultStats = [
  { value: '+۵۰۰۰', label: 'مشتری راضی', icon: Heart },
  { value: '+۲۰۰', label: 'محصول متنوع', icon: Sparkles },
  { value: '۹۸٪', label: 'رضایت مشتری', icon: TrendingUp },
  { value: '۱۰۰٪', label: 'محصول اورجینال', icon: Shield },
];

const Home = () => {
  const [email, setEmail] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch data from API
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  const { data: newProducts = [], isLoading: newProductsLoading } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => getProducts({ isNew: true, limit: 4 })
  });

  const { data: bestSellers = [], isLoading: bestsellersLoading } = useQuery({
    queryKey: ['products', 'bestseller'],
    queryFn: () => getProducts({ isBestseller: true, limit: 4 })
  });

  const { data: settings } = useQuery({
    queryKey: ['home-settings'],
    queryFn: getHomeSettings
  });

  const handleWomenNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "ثبت شد!",
        description: "از اطلاع رسانی کلکسیون زنانه متشکریم"
      });
      setEmail('');
    }
  };

  const hero = settings?.hero || {
    badge: 'کلکسیون زمستان 1404',
    title: 'استایل استریت',
    titleHighlight: 'برای نسل جدید',
    subtitle: 'هودی، شلوار و اکسسوری‌های اورجینال با کیفیت پرمیوم',
    ctaPrimary: 'خرید محصولات',
    ctaSecondary: 'درباره TM-BRAND',
  };

  const stats = settings?.stats || defaultStats.map(s => ({ value: s.value, label: s.label }));

  return (
    <div className="min-h-screen overflow-hidden">
      <ScrollProgress />
      <FloatingContactButton />
      
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Animated Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float morph-blob" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial opacity-50" />
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-32 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-primary/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Content */}
            <div className="text-center lg:text-right order-2 lg:order-1" dir="rtl">
              <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
                <Badge className="px-5 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/30 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 ml-2" />
                  {hero.badge}
                </Badge>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-hero font-bold text-foreground mb-6 md:mb-8 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="inline-block">{hero.title}</span>
                <span className="block mt-2 text-gradient-shine text-right text-4xl font-bold">{hero.titleHighlight}</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 md:mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                {hero.subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="group text-lg px-10 h-16 rounded-2xl shadow-neon hover:shadow-neon-strong transition-all duration-500">
                  <Link to="/shop" className="flex items-center gap-3">
                    {hero.ctaPrimary}
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-10 h-16 rounded-2xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  <Link to="/about">{hero.ctaSecondary}</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: CheckCircle2, title: 'اورجینال', subtitle: '۱۰۰٪ اصل' },
                  { icon: Truck, title: 'ارسال سریع', subtitle: '۲۴ ساعته' },
                  { icon: RotateCcw, title: 'برگشت آسان', subtitle: '۷ روزه' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-4 group">
                    <div className="w-14 h-14 rounded-2xl bg-card/80 backdrop-blur-sm border border-border/50 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3D Brand Logo */}
            <div className="order-1 lg:order-2 flex items-center justify-center animate-scale-in">
              <div className="relative w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] scale-75" />
                <Hero3DText />
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: '1s' }}>
          <span className="text-sm text-muted-foreground">اسکرول کنید</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-surface" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-accent/5 rounded-full blur-[80px]" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade-up" className="text-center mb-16">
            <div dir="rtl">
              <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/30">
                <Zap className="h-4 w-4 ml-2" />
                دسته‌بندی‌ها
              </Badge>
              <h2 className="text-foreground mb-6">دسته‌بندی محصولات</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                از هودی‌های اورسایز تا کفش‌های استریت، همه چیز برای استایل شما
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categoriesLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl" />
              ))
            ) : (
              categories.map((category, index) => (
                <ScrollReveal key={category.id} animation="scale" delay={index * 100} className="h-full">
                  <Link to={`/category/${category.slug}`} className="block h-full">
                    <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover-lift h-full">
                      <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <CardContent className="p-4 md:p-6 text-center relative z-10">
                        <div className="relative w-full aspect-square bg-muted/30 rounded-2xl mb-4 overflow-hidden">
                          <img 
                            src={categoryImages[category.slug] || hoodieBlack} 
                            alt={category.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                            loading="lazy" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300" dir="rtl">
                          {category.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 font-display">{category.slug}</p>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = defaultStats[index]?.icon || Heart;
              return (
                <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                  <div className="text-center group" dir="rtl">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                      <IconComponent className="w-8 h-8 text-primary" />
                    </div>
                    <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute top-0 -left-64 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade-right">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6" dir="rtl">
              <div>
                <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/30">
                  <Star className="h-4 w-4 ml-2" />
                  جدیدترین‌ها
                </Badge>
                <h2 className="text-foreground mb-3">جدیدترین محصولات</h2>
                <p className="text-muted-foreground text-lg">آخرین محصولات اضافه شده به TM-BRAND</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex gap-2 h-12 px-6 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5">
                <Link to="/shop?filter=new">
                  مشاهده همه
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newProductsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))
            ) : newProducts.length > 0 ? (
              newProducts.map((product, index) => (
                <ScrollReveal key={product.id} animation="fade-up" delay={index * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground" dir="rtl">
                محصول جدیدی یافت نشد
              </div>
            )}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full max-w-sm h-12 rounded-xl">
              <Link to="/shop?filter=new">مشاهده همه محصولات جدید</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-surface" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="fade-left">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6" dir="rtl">
              <div>
                <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/30">
                  <Heart className="h-4 w-4 ml-2" />
                  پرفروش‌ها
                </Badge>
                <h2 className="text-foreground mb-3">پرفروش‌ترین محصولات</h2>
                <p className="text-muted-foreground text-lg">محبوب‌ترین انتخاب‌های مشتریان TM-BRAND</p>
              </div>
              <Button asChild variant="outline" className="hidden md:flex gap-2 h-12 px-6 rounded-xl border-border/50 hover:border-primary/50 hover:bg-primary/5">
                <Link to="/shop?filter=bestseller">
                  مشاهده همه
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestsellersLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
              ))
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product, index) => (
                <ScrollReveal key={product.id} animation="scale" delay={index * 100}>
                  <ProductCard product={product} />
                </ScrollReveal>
              ))
            ) : (
              <div className="col-span-4 text-center py-12 text-muted-foreground" dir="rtl">
                محصول پرفروشی یافت نشد
              </div>
            )}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full max-w-sm h-12 rounded-xl">
              <Link to="/shop?filter=bestseller">مشاهده همه پرفروش‌ها</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 md:py-32 relative">
        <div className="absolute inset-0 bg-gradient-radial opacity-30 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center" dir="rtl">
            <ScrollReveal animation="blur">
              <Badge className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/30">
                داستان ما
              </Badge>
              <h2 className="text-foreground mb-8">TM-BRAND، همراه استایل شما</h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-12">
                ما در TM-BRAND باور داریم که پوشاک فقط لباس نیست، بلکه بیانگر هویت و سبک زندگی شماست. 
                هر محصول ما با دقت طراحی شده تا به شما کمک کند استایل منحصر به فرد خودتان را بسازید.
              </p>
              <Button asChild size="lg" className="gap-2">
                <Link to="/about">
                  بیشتر بخوانید
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Women's Collection Coming Soon */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-surface" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center" dir="rtl">
            <ScrollReveal animation="fade-up">
              <Badge className="mb-6 px-4 py-2 bg-pink-500/10 text-pink-500 border-pink-500/30">
                به‌زودی
              </Badge>
              <h2 className="text-foreground mb-4">کلکسیون زنانه</h2>
              <p className="text-muted-foreground mb-8">
                کلکسیون زنانه TM-BRAND به‌زودی عرضه می‌شود. برای اطلاع از زمان عرضه، ایمیل خود را ثبت کنید.
              </p>
              <form onSubmit={handleWomenNotification} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder="ایمیل شما"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl"
                  dir="ltr"
                />
                <Button type="submit" className="h-12 px-8 rounded-xl">
                  ثبت
                </Button>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />
    </div>
  );
};

export default Home;
