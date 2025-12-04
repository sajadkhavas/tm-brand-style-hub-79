import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, Target, Users, Zap, Award, Heart, Sparkles, ArrowLeft } from 'lucide-react';
import aboutStore from '@/assets/about-store.jpg';

const About = () => {
  const values = [
    {
      icon: CheckCircle2,
      title: 'اصالت',
      description: 'تمامی محصولات ما ۱۰۰٪ اورجینال و با بالاترین کیفیت هستند'
    },
    {
      icon: Zap,
      title: 'نوآوری',
      description: 'طراحی‌های منحصر به فرد و مدرن برای استایل روز شما'
    },
    {
      icon: Users,
      title: 'جامعه',
      description: 'ساختن یک جامعه از افراد با سبک زندگی فعال و پویا'
    },
    {
      icon: Heart,
      title: 'کیفیت',
      description: 'استفاده از بهترین مواد اولیه و دقت در تولید'
    }
  ];

  const stats = [
    { value: '۱۰۰٪', label: 'محصولات اورجینال' },
    { value: '۲۴/۷', label: 'پشتیبانی' },
    { value: '۷ روز', label: 'ضمانت بازگشت' },
    { value: 'رایگان', label: 'ارسال سریع' }
  ];

  const milestones = [
    { year: '۱۴۰۰', title: 'شروع TM-BRAND', description: 'آغاز فعالیت با هدف ارائه پوشاک استریت‌ویر باکیفیت' },
    { year: '۱۴۰۱', title: 'توسعه محصولات', description: 'افزودن دسته‌بندی‌های جدید شامل کفش و اکسسوری' },
    { year: '۱۴۰۲', title: 'رشد جامعه', description: 'جذب هزاران مشتری وفادار در سراسر ایران' },
    { year: '۱۴۰۳', title: 'فروشگاه آنلاین', description: 'راه‌اندازی وب‌سایت و تجربه خرید آنلاین' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center" dir="rtl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">داستان ما</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              استایل استریت برای
              <span className="text-primary block">نسل جدید</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              TM-BRAND یک برند اصیل و مدرن پوشاک استریت‌ویر و اسپرت است که با تمرکز بر کیفیت، 
              طراحی منحصر به فرد و راحتی، محصولاتی را برای نسل جوان و سبک‌زندگی پویا ارائه می‌دهد.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Brand Image Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden">
            <img 
              src={aboutStore} 
              alt="نمای فروشگاه TM-BRAND در پاساژ"
              className="w-full h-64 md:h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-6 right-6 left-6 text-right" dir="rtl">
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-2">فروشگاه TM-BRAND</h3>
              <p className="text-muted-foreground">استایل استریت‌ویر پرمیوم</p>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Values */}
      <section className="py-16 md:py-24 bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">ارزش‌های ما</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              این ارزش‌ها پایه و اساس تمام کارهایی است که انجام می‌دهیم
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="group hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 text-center" dir="rtl">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Story */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div dir="rtl">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                <Target className="h-4 w-4" />
                <span className="text-sm font-medium">مأموریت ما</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                ارائه پوشاک باکیفیت برای سبک زندگی مدرن
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  TM-BRAND از ایده‌ای ساده آغاز شد: ارائه پوشاک استریت‌ویر با کیفیت بالا برای نسل جوانی که 
                  به دنبال ترکیبی از راحتی، استایل و اصالت هستند.
                </p>
                <p>
                  ما باور داریم که پوشاک نباید فقط زیبا باشد، بلکه باید احساس خوبی هم به شما بدهد. 
                  هر محصول ما با دقت طراحی و انتخاب شده تا بهترین تجربه را برای شما فراهم کند.
                </p>
                <p>
                  از هودی‌های اورسایز تا کفش‌های اسپرت، هر قطعه از TM-BRAND داستانی از کیفیت و سبک را 
                  روایت می‌کند.
                </p>
              </div>
              <Button asChild size="lg" className="mt-8 gap-2">
                <Link to="/shop">
                  مشاهده محصولات
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl flex items-center justify-center">
                <div className="text-center" dir="rtl">
                  <Award className="h-24 w-24 text-primary mx-auto mb-4" />
                  <p className="text-2xl font-bold text-foreground">+۳ سال تجربه</p>
                  <p className="text-muted-foreground">در صنعت پوشاک</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/10 rounded-2xl blur-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Timeline */}
      <section className="py-16 md:py-24 bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">مسیر ما</h2>
            <p className="text-muted-foreground">از ایده تا برند محبوب شما</p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8" dir="rtl">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-6 items-start group">
                  <div className="w-20 flex-shrink-0">
                    <span className="text-primary font-bold text-lg">{milestone.year}</span>
                  </div>
                  <div className="flex-1 pb-8 border-r-2 border-primary/30 pr-6 relative group-hover:border-primary transition-colors">
                    <div className="absolute -right-2 top-1 w-4 h-4 bg-primary rounded-full group-hover:scale-125 transition-transform" />
                    <h3 className="font-bold text-foreground mb-1">{milestone.title}</h3>
                    <p className="text-muted-foreground text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Stats */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-colors" dir="rtl">
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 to-background">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto border-primary/30">
            <CardContent className="p-8 md:p-12 text-center" dir="rtl">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                آماده‌اید استایل خود را بسازید؟
              </h2>
              <p className="text-muted-foreground mb-8">
                محصولات TM-BRAND را ببینید و سبک منحصر به فرد خود را پیدا کنید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/shop">فروشگاه</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">تماس با ما</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default About;
