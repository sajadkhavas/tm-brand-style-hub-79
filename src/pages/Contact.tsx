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

  const { data: page, isLoading } = useQuery({
    queryKey: ['page', 'contact'],
    queryFn: () => getPageBySlug('contact')
  });

  const structuredContent = useMemo(() => {
    if (!page?.content) return null;
    try {
      return JSON.parse(page.content);
    } catch (error) {
      console.warn('Contact page content is not JSON; rendering as HTML.', error);
      return null;
    }
  }, [page]);

  const contactMethods = structuredContent?.contactMethods || [];
  const faqs = structuredContent?.faqs || [];
  const additionalHtml = !structuredContent ? page?.content : structuredContent?.html;

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const success = await submitContactForm(formData);

    if (success) {
      toast({
        title: "پیام ارسال شد",
        description: "به زودی با شما تماس خواهیم گرفت",
      });
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } else {
      toast({
        variant: 'destructive',
        title: 'خطا در ارسال پیام',
        description: 'لطفاً دوباره تلاش کنید',
      });
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen" dir="rtl">
      <Helmet>
        <title>{page?.metaTitle || page?.title || 'تماس با TM-BRAND'}</title>
        {page?.metaDescription && <meta name="description" content={page.metaDescription} />}
      </Helmet>

      {isLoading ? (
        <div className="container mx-auto px-4 py-20 space-y-8">
          <Skeleton className="h-12 w-1/2 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section */}
          <section className="relative py-16 md:py-24 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-2xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
                  <MessageCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">ارتباط با ما</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                  {page?.title || 'سوالات خود را با ما مطرح کنید'}
                </h1>
                <p className="text-xl text-muted-foreground">
                  {page?.excerpt || 'تیم پشتیبانی TM-BRAND آماده پاسخگویی به شماست.'}
                </p>
              </div>
            </div>
          </section>

          {/* Decorative Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Contact Methods */}
          {contactMethods.length > 0 && (
            <section className="py-12 bg-dark-surface">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {contactMethods.map((method: any, index: number) => {
                    const Icon = iconMap[method.icon as string] || Send;

                    return (
                      <a
                        key={`${method.title}-${index}`}
                        href={method.href}
                        target={method.href?.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Card className="h-full hover:border-primary/50 transition-all duration-300 group">
                          <CardContent className="p-4 md:p-6 text-center">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                              <Icon className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-1">{method.title}</h3>
                            <p className="text-primary font-medium text-sm mb-1">{method.value}</p>
                            {method.description && (
                              <p className="text-xs text-muted-foreground">{method.description}</p>
                            )}
                          </CardContent>
                        </Card>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* Decorative Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Main Content */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                {/* Contact Form */}
                <Card className="border-border/50">
                  <CardContent className="p-6 md:p-8">
                    <div className="mb-6">
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3">
                        <Send className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">فرم تماس</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">پیام خود را بنویسید</h2>
                      <p className="text-muted-foreground text-sm">ما در اسرع وقت پاسخ می‌دهیم</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">نام و نام خانوادگی *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">موضوع پیام *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          required
                          placeholder="موضوع"
                          className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">متن پیام *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          required
                          placeholder="پیام خود را اینجا بنویسید"
                          className="min-h-[140px] transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                {/* FAQ */}
                {faqs.length > 0 && (
                  <div className="space-y-6">
                    <div>
                      <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full mb-3">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium">سوالات پرتکرار</span>
                      </div>
                      <h2 className="text-2xl font-bold text-foreground mb-2">هر آنچه باید بدانید</h2>
                      {page?.excerpt && (
                        <p className="text-muted-foreground text-sm">{page.excerpt}</p>
                      )}
                    </div>

                    <Accordion type="single" collapsible className="space-y-4">
                      {faqs.map((faq: any, index: number) => (
                        <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-xl px-4">
                          <AccordionTrigger className="text-right text-base font-semibold text-foreground">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-right text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Additional CMS content */}
          {additionalHtml && (
            <section className="py-12">
              <div className="container mx-auto px-4">
                <div
                  className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: additionalHtml }}
                />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default Contact;
