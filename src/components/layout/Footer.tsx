import { Link } from 'react-router-dom';
import { Instagram, Send, Phone, Mail, MapPin, CreditCard, Truck, RotateCcw, Shield, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const categoryLinks = [
    { path: '/hoodies', label: 'هودی و سویشرت' },
    { path: '/tshirts', label: 'تیشرت' },
    { path: '/pants', label: 'شلوار' },
    { path: '/jeans', label: 'شلوار جین' },
    { path: '/shoes', label: 'کفش' },
    { path: '/accessories', label: 'اکسسوری' },
  ];

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-dark-surface border-t border-border/30 overflow-hidden" dir="rtl">
      {/* Background Effects */}
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      
      {/* Trust Badges */}
      <div className="border-b border-border/20 relative z-10">
        <div className="container mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Truck, title: 'ارسال سریع', desc: '۲ تا ۵ روز کاری' },
              { icon: RotateCcw, title: 'برگشت آسان', desc: 'تا ۷ روز' },
              { icon: Shield, title: 'ضمانت اصالت', desc: '۱۰۰٪ اورجینال' },
              { icon: CreditCard, title: 'پرداخت امن', desc: 'درگاه مطمئن' },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-4 justify-center group">
                <div className="w-14 h-14 bg-card/50 backdrop-blur-sm border border-border/30 rounded-2xl flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-1 mb-6">
              <span className="text-3xl font-extrabold text-primary tracking-tight font-display">TM</span>
              <span className="text-2xl font-bold text-foreground font-display">-BRAND</span>
            </Link>
            <p className="text-muted-foreground leading-relaxed mb-8">
              برند اصیل پوشاک استریت‌ویر و اسپرت برای نسل جدید. کیفیت، استایل و راحتی در کنار هم.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://instagram.com/tm.brand" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://t.me/tmbrand" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 bg-card/50 backdrop-blur-sm border border-border/30 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300"
              >
                <Send className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-6 font-display">دسته‌بندی محصولات</h3>
            <ul className="space-y-4">
              {categoryLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-6 font-display">خدمات مشتریان</h3>
            <ul className="space-y-4">
              {[
                { path: '/shop', label: 'فروشگاه' },
                { path: '/blog', label: 'وبلاگ' },
                { path: '/contact', label: 'تماس با ما' },
                { path: '/about', label: 'درباره TM-BRAND' },
                { path: '#', label: 'سوالات متداول' },
                { path: '#', label: 'راهنمای سایز' },
              ].map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className="text-muted-foreground hover:text-primary transition-colors duration-300 flex items-center gap-2 group focus-visible:outline-none focus-visible:text-primary">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg text-foreground mb-6 font-display">ارتباط با ما</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-foreground font-medium">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  <p className="text-sm text-muted-foreground">شنبه تا پنج‌شنبه ۹-۱۸</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <p className="text-foreground">info@tm-brand.com</p>
              </li>
              <li className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <p className="text-muted-foreground">تهران، ایران</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border/20 relative z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {currentYear} TM-BRAND. تمامی حقوق محفوظ است.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                حریم خصوصی
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                شرایط استفاده
              </a>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl hover:bg-primary/10 hover:text-primary"
                onClick={scrollToTop}
              >
                <ArrowUp className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};