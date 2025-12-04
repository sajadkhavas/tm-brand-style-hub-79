import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Instagram, Send, Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2, Sparkles } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "پیام ارسال شد",
      description: "به زودی با شما تماس خواهیم گرفت",
    });
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'تلفن',
      value: '۰۲۱-۱۲۳۴۵۶۷۸',
      description: 'شنبه تا پنج‌شنبه ۹-۱۸',
      href: 'tel:02112345678'
    },
    {
      icon: MessageCircle,
      title: 'واتساپ',
      value: '۰۹۱۲-۳۴۵-۶۷۸۹',
      description: 'پاسخگویی سریع',
      href: 'https://wa.me/989123456789'
    },
    {
      icon: Mail,
      title: 'ایمیل',
      value: 'info@tm-brand.com',
      description: 'پاسخ در ۲۴ ساعت',
      href: 'mailto:info@tm-brand.com'
    },
    {
      icon: Instagram,
      title: 'اینستاگرام',
      value: '@tm.brand',
      description: 'دایرکت و کامنت',
      href: 'https://instagram.com/tm.brand'
    }
  ];

  const faqs = [
    {
      question: 'چگونه سفارش دهم؟',
      answer: 'محصولات مورد نظر را به سبد خرید اضافه کنید و از طریق فرم تسویه حساب یا واتساپ سفارش خود را نهایی کنید. همچنین می‌توانید مستقیماً از طریق واتساپ یا تلگرام سفارش دهید.'
    },
    {
      question: 'زمان ارسال چقدر است؟',
      answer: 'سفارشات معمولاً ظرف ۲ تا ۵ روز کاری به دست شما می‌رسند. برای تهران و کرج ارسال ۱ تا ۲ روز کاری است.'
    },
    {
      question: 'آیا می‌توانم محصول را برگردانم؟',
      answer: 'بله، تا ۷ روز پس از دریافت کالا، در صورت عدم استفاده و حفظ برچسب‌ها، امکان بازگشت کالا وجود دارد.'
    },
    {
      question: 'هزینه ارسال چقدر است؟',
      answer: 'برای خریدهای بالای ۵۰۰,۰۰۰ تومان ارسال رایگان است. برای سایر سفارشات هزینه ارسال بر اساس شهر مقصد محاسبه می‌شود.'
    },
    {
      question: 'چگونه سایز مناسب را انتخاب کنم؟',
      answer: 'در صفحه هر محصول راهنمای سایز قرار دارد. همچنین می‌توانید از طریق واتساپ با کارشناسان ما مشورت کنید.'
    },
    {
      question: 'آیا محصولات اورجینال هستند؟',
      answer: 'بله، تمامی محصولات tm-brand اورجینال و با ضمانت اصالت عرضه می‌شوند.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center" dir="rtl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">ارتباط با ما</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              سوالی دارید؟
            </h1>
            <p className="text-xl text-muted-foreground">
              دوست داریم از شما بشنویم. تیم پشتیبانی tm-brand آماده کمک به شماست.
            </p>
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Contact Methods */}
      <section className="py-12 bg-dark-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="block"
              >
                <Card className="h-full hover:border-primary/50 transition-all duration-300 group">
                  <CardContent className="p-4 md:p-6 text-center" dir="rtl">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                      <method.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                    <p className="text-primary font-medium text-sm mb-1">{method.value}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Decorative Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <Card className="border-border/50">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6" dir="rtl">
                  <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3">
                    <Send className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">فرم تماس</span>
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">پیام خود را بنویسید</h2>
                  <p className="text-muted-foreground text-sm">ما در اسرع وقت پاسخ می‌دهیم</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">نام و نام خانوادگی *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                        placeholder="نام شما"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">شماره تماس *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@example.com"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">موضوع *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      required
                      placeholder="موضوع پیام شما"
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">پیام *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows={5}
                      placeholder="پیام خود را بنویسید..."
                      className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin">⏳</span>
                        در حال ارسال...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        ارسال پیام
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* FAQ */}
            <div dir="rtl">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="text-xs font-medium">راهنما</span>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">سوالات متداول</h2>
                <p className="text-muted-foreground text-sm">پاسخ سوالات رایج مشتریان</p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`faq-${index}`}
                    className="bg-card border border-border rounded-lg px-4 hover:border-primary/50 transition-colors"
                  >
                    <AccordionTrigger className="text-right hover:no-underline py-4">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Quick Info */}
              <Card className="mt-8 border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    ساعات پاسخگویی
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">شنبه تا چهارشنبه</span>
                      <span className="text-foreground font-medium">۹:۰۰ - ۱۸:۰۰</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                      <span className="text-muted-foreground">پنج‌شنبه</span>
                      <span className="text-foreground font-medium">۹:۰۰ - ۱۴:۰۰</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">جمعه</span>
                      <span className="text-foreground font-medium">تعطیل</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-border/50">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">
                        پشتیبانی واتساپ ۲۴ ساعته فعال است و در اسرع وقت پاسخگوی شما هستیم.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;