import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { Hero3DText } from '@/components/home/Hero3DText';
import { ScrollReveal } from '@/components/animations/ScrollReveal';
import { ScrollProgress } from '@/components/animations/ScrollProgress';
import { BlogSection } from '@/components/home/BlogSection';
import { products, categories } from '@/data/products';
import { CheckCircle2, Truck, RotateCcw, ArrowLeft, Sparkles, Star, Zap, Heart, TrendingUp, Shield } from 'lucide-react';
import { useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FloatingContactButton } from '@/components/layout/FloatingContactButton';

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

const Home = () => {
  const [email, setEmail] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const newProducts = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  const handleWomenNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "ثبت شد!",
        description: "از اطلاع رسانی کلکسیون زنانه متشکریم",
      });
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen overflow-hidden">
      <ScrollProgress />
      <FloatingContactButton />
      
      {/* Hero Section with Mouse Parallax */}
      <section ref={heroRef} className="relative min-h-[100vh] flex items-center overflow-hidden">
        {/* Animated Background Effects with Parallax */}
        <div className="absolute inset-0">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-grid opacity-30" />
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-float morph-blob" />
          <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial opacity-50" />
          
          {/* Animated Lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
          
          {/* Floating particles */}
          <div className="absolute top-20 left-20 w-2 h-2 bg-primary/40 rounded-full animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-40 right-32 w-3 h-3 bg-primary/30 rounded-full animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-primary/50 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Content */}
            <div className="text-center lg:text-right order-2 lg:order-1" dir="rtl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8 animate-fade-in">
                <Badge className="px-5 py-2 text-sm font-medium bg-primary/10 text-primary border border-primary/30 backdrop-blur-sm">
                  <Sparkles className="w-4 h-4 ml-2" />
                  کلکسیون زمستان ۱۴۰۳
                </Badge>
              </div>

              {/* Main Heading */}
              <h1 className="text-hero font-bold text-foreground mb-8 leading-[1.1] animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <span className="inline-block">استایل استریت</span>
                <span className="block mt-2 text-gradient-shine">برای نسل جدید</span>
              </h1>

              {/* Subheading */}
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
                هودی، شلوار و اکسسوری‌های اورجینال با کیفیت پرمیوم و طراحی منحصر به فرد
              </p>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-16 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                <Button asChild size="lg" className="group text-lg px-10 h-16 rounded-2xl shadow-neon hover:shadow-neon-strong transition-all duration-500">
                  <Link to="/shop" className="flex items-center gap-3">
                    خرید محصولات
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-10 h-16 rounded-2xl border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  <Link to="/about">درباره TM-BRAND</Link>
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '0.4s' }}>
                {[
                  { icon: CheckCircle2, title: 'اورجینال', subtitle: '۱۰۰٪ اصل' },
                  { icon: Truck, title: 'ارسال سریع', subtitle: '۲۴ ساعته' },
                  { icon: RotateCcw, title: 'برگشت آسان', subtitle: '۷ روزه' },
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
                {/* Glow Effect Behind */}
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-[100px] scale-75 morph-blob" />
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

      {/* Category Highlights with Scroll Animations */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-dark-surface" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        {/* Static background elements */}
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
              <h2 className="text-foreground mb-6">
                دسته‌بندی محصولات
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                از هودی‌های اورسایز تا کفش‌های استریت، همه چیز برای استایل شما
              </p>
            </div>
          </ScrollReveal>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <ScrollReveal 
                key={category.id} 
                animation="scale" 
                delay={index * 100}
                className="h-full"
              >
                <Link to={`/${category.id}`} className="block h-full">
                  <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 hover-lift h-full perspective-card gradient-border">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-4 md:p-6 text-center relative z-10">
                      <div className="relative w-full aspect-square bg-muted/30 rounded-2xl mb-4 overflow-hidden">
                        <img 
                          src={categoryImages[category.id]} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300" dir="rtl">
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 font-display">{category.nameEn}</p>
                    </CardContent>
                  </Card>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section with Counter Animation */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '+۵۰۰۰', label: 'مشتری راضی', icon: Heart },
              { value: '+۲۰۰', label: 'محصول متنوع', icon: Sparkles },
              { value: '۹۸٪', label: 'رضایت مشتری', icon: TrendingUp },
              { value: '۱۰۰٪', label: 'محصول اورجینال', icon: Shield },
            ].map((stat, index) => (
              <ScrollReveal key={index} animation="fade-up" delay={index * 150}>
                <div className="text-center group" dir="rtl">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <stat.icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
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
            {newProducts.map((product, index) => (
              <ScrollReveal key={product.id} animation="fade-up" delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
          <div className="mt-10 text-center md:hidden">
            <Button asChild variant="outline" className="w-full max-w-sm h-12 rounded-xl">
              <Link to="/shop?filter=new">مشاهده همه محصولات جدید</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers with Enhanced Animations */}
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
            {bestSellers.map((product, index) => (
              <ScrollReveal key={product.id} animation="scale" delay={index * 100}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
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
              <Badge className="mb-8 px-4 py-2 bg-primary/10 text-primary border-primary/30">
                <Sparkles className="h-4 w-4 ml-2" />
                داستان ما
              </Badge>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={100}>
              <h2 className="text-foreground mb-8">درباره TM-BRAND</h2>
            </ScrollReveal>
            
            <ScrollReveal animation="fade-up" delay={200}>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                TM-BRAND یک برند اصیل و مدرن پوشاک اسپرت و استریت ویر است که با تمرکز بر کیفیت، 
                طراحی منحصر به فرد و راحتی، محصولاتی را برای نسل جوان و سبک‌زندگی پویا ارائه می‌دهد. 
                ما به اصالت، نوآوری و استایل اعتقاد داریم.
              </p>
            </ScrollReveal>
            
            {/* Value Cards with 3D Effect */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 perspective-container">
              {[
                { icon: CheckCircle2, title: 'اصالت', desc: 'محصولات ۱۰۰٪ اورجینال' },
                { icon: Sparkles, title: 'کیفیت', desc: 'بهترین مواد و ساخت' },
                { icon: Star, title: 'استایل', desc: 'طراحی‌های منحصر به فرد' },
              ].map((item, index) => (
                <ScrollReveal key={index} animation="rotate" delay={index * 150}>
                  <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/50 transition-all duration-500 perspective-card gradient-border">
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <CardContent className="p-8 text-center relative z-10">
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                        <item.icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-2xl mb-3 font-display">{item.title}</h3>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal animation="fade-up" delay={500}>
              <Button asChild size="lg" className="mt-12 h-14 px-10 rounded-2xl" variant="outline">
                <Link to="/about" className="gap-3">
                  بیشتر بدانید
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* بخش وبلاگ TM-BRAND */}
      <BlogSection />

      {/* Women's Collection Coming Soon */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-dark-surface" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <ScrollReveal animation="scale">
            <Card className="max-w-3xl mx-auto border-primary/30 overflow-hidden bg-card/50 backdrop-blur-xl gradient-border">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] morph-blob" />
              
              <CardContent className="p-10 md:p-16 text-center relative z-10" dir="rtl">
                <Badge className="mb-6 text-lg px-6 py-2 animate-pulse-glow">به زودی</Badge>
                <h2 className="text-foreground mb-6">
                  کلکسیون زنانه در راه است!
                </h2>
                <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
                  به زودی مجموعه‌ای از پوشاک، کیف و کفش زنانه با همان کیفیت و استایل TM-BRAND را معرفی خواهیم کرد.
                  برای اطلاع از زمان عرضه، ایمیل خود را ثبت کنید.
                </p>
                <form onSubmit={handleWomenNotification} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="ایمیل شما"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 h-14 rounded-xl bg-background/50 border-border/50 focus:border-primary"
                    dir="rtl"
                  />
                  <Button type="submit" size="lg" className="h-14 px-8 rounded-xl shadow-neon hover:shadow-neon-strong">
                    ثبت اطلاعات
                  </Button>
                </form>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
