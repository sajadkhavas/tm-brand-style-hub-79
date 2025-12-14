import { useMemo, useState, type ComponentType } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { submitContactForm } from '@/api/contact';
import { getPageBySlug } from '@/api/pages';
import { Instagram, Send, Phone, Mail, MapPin, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';
import DynamicPage from './DynamicPage';

const iconMap: Record<string, ComponentType> = {
  phone: Phone,
  mail: Mail,
  email: Mail,
  map: MapPin,
  location: MapPin,
  whatsapp: MessageCircle,
  instagram: Instagram,
  clock: Clock,
  check: CheckCircle2,
  send: Send,
  message: MessageCircle
};

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

  const { data: page, isLoading, error } = useQuery({
    queryKey: ['page', 'contact'],
    queryFn: () => getPageBySlug('contact')
  });

  const structured = useMemo(() => {
    if (!page?.content) return null;
    try {
      return JSON.parse(page.content);
    } catch (err) {
      return null;
    }
  }, [page]);

  const contactMethods = structured?.contactMethods || [];
  const faqs = structured?.faqs || [];
  const heroSubtitle = structured?.hero?.subtitle;
  const extraHtml = structured?.html || (!structured ? page?.content : '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await submitContactForm(formData);

    if (success) {
      toast({
        title: 'پیام ارسال شد',
        description: 'به زودی با شما تماس خواهیم گرفت'
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      toast({
        variant: 'destructive',
        title: 'خطا در ارسال پیام',
        description: 'لطفاً دوباره تلاش کنید'
      });
    }

    setIsSubmitting(false);
  };

  if (error) {
    return <DynamicPage defaultSlug="contact" />;
  }

  return (
    <div className="min-h-screen" dir="rtl">
      <Helmet>
        <title>{page?.metaTitle || page?.title || 'TM-BRAND'}</title>
        {page?.metaDescription && <meta name="description" content={page.metaDescription} />}
      </Helmet>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-12 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-full mx-auto" />
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  {page?.title}
                </h1>
                {(page?.excerpt || heroSubtitle) && (
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {heroSubtitle || page?.excerpt}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            </div>

      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10">
          <Card className="border-primary/30 bg-card/80 backdrop-blur">
            <CardContent className="p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">فرم تماس</h2>
                <p className="text-muted-foreground">پیام خود را برای ما ارسال کنید</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">نام و نام خانوادگی</Label>
                    <Input
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="نام کامل"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">شماره تماس</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="0912xxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">موضوع</Label>
                    <Input
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="موضوع پیام"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">پیام</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="پیام خود را بنویسید"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold">راه‌های ارتباطی</h3>
                  <p className="text-muted-foreground">اطلاعات تماس ثبت‌شده در پنل مدیریت</p>
                </div>

                {isLoading && (
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <Skeleton key={idx} className="h-14 w-full" />
                    ))}
                  </div>
                )}

                {!isLoading && contactMethods.length === 0 && (
                  <p className="text-muted-foreground">اطلاعات تماس هنوز در پنل ثبت نشده است.</p>
                )}

                <div className="space-y-3">
                  {contactMethods.map((method, index) => {
                    const Icon = iconMap[method.icon?.toLowerCase?.() || 'message'] || MessageCircle;
                    return (
                      <div
                        key={`${method.label}-${index}`}
                        className="flex items-center justify-between gap-4 p-3 border rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </span>
                          <div>
                            <p className="font-medium">{method.label}</p>
                            <p className="text-sm text-muted-foreground break-words">{method.value}</p>
                          </div>
                        </div>
                        {method.link && (
                          <a
                            href={method.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm text-primary hover:text-primary/80"
                          >
                            ارتباط
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {faqs.length > 0 && (
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">سؤالات متداول</h3>
                    <p className="text-muted-foreground">پاسخ‌های ثبت‌شده در پنل</p>
                  </div>
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {faqs.map((item: any, index: number) => (
                      <AccordionItem key={index} value={`faq-${index}`}>
                        <AccordionTrigger className="text-right">{item.question}</AccordionTrigger>
                        <AccordionContent className="text-right text-muted-foreground">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            )}

            {extraHtml && (
              <Card>
                <CardContent className="p-6">
                  <div
                    className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: extraHtml }}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
