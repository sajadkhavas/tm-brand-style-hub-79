import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const BlogSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-dark-surface/80" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 relative z-10" dir="rtl">
        {/* هدر وبلاگ */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <Badge className="mb-4 px-4 py-1.5">وبلاگ TM-BRAND</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
              آخرین نکته‌های استایل
            </h2>
            <p className="text-muted-foreground max-w-xl">
              اینجا نکته‌های کوتاه و کاربردی می‌گذاریم تا بهتر از هودی‌ها، شلوارها و اکسسوری‌های TM-BRAND استفاده کنی.
            </p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm text-muted-foreground md:text-right">
            <span className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              آخرین بروزرسانی: دی ۱۴۰۳
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              حدود ۴ دقیقه مطالعه
            </span>
          </div>
        </div>

        {/* محتوا + سایدبار */}
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8 items-start">
          {/* مقاله اصلی */}
          <Card className="border-border/40 bg-card/80 backdrop-blur-xl">
            <CardContent className="p-6 md:p-8 leading-relaxed space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                راهنمای انتخاب هودی زمستانی TM-BRAND
              </h3>
              <p className="text-muted-foreground">
                هودی یکی از اصلی‌ترین آیتم‌های استایل خیابانی است؛ مخصوصاً در فصل پاییز و زمستان. اگر فقط یک لباس قرار است هر روز همراهت باشد،
                بهتر است در انتخابش وسواس داشته باشی: جنس، فرم تن‌خور، قد و رنگ همگی مهم‌اند.
              </p>
              <p className="text-muted-foreground">
                در TM-BRAND ما هودی‌ها را طوری طراحی کرده‌ایم که هم مناسب استفاده روزمره باشند، هم در استایل‌های اسپرت و استریت‌ویر بدرخشند.
                اگر تیپ مینیمال دوست داری، رنگ‌های خنثی مثل مشکی، طوسی و کرم بهترین انتخاب هستند؛ هم با اکثر شلوارها ست می‌شوند و هم دیرتر تکراری می‌شوند.
              </p>
              <p className="text-muted-foreground">
                برای استایل جسورتر، می‌توانی از هودی‌های رنگی یا طرح‌دار استفاده کنی؛ به‌شرطی که بقیه آیتم‌ها را ساده نگه داری. مثلاً یک هودی رنگی TM-BRAND
                با شلوار کارگو ساده و کتانی سفید، یک ترکیب ایده‌آل برای استایل روزمره است.
              </p>

              <div className="pt-4 border-t border-border/40 flex flex-wrap items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  استایل زمستانی
                </span>
                <span className="px-3 py-1 rounded-full bg-muted/40 text-xs text-muted-foreground">
                  هودی، شلوار، استریت‌ویر
                </span>
              </div>
            </CardContent>
          </Card>

          {/* سایدبار وبلاگ */}
          <div className="space-y-4">
            <Card className="border-dashed border-border/50 bg-card/60">
              <CardContent className="p-5 space-y-2 text-sm text-muted-foreground">
                <h4 className="font-semibold text-foreground">ایده‌های بعدی وبلاگ</h4>
                <ul className="list-disc pr-4 space-y-1">
                  <li>راهنمای ست کردن شلوار کارگو با کتانی حجیم</li>
                  <li>چطور از کپ (کلاه نقاب‌دار) در استایل روزمره استفاده کنیم</li>
                  <li>چند روش برای مراقبت از هودی و تیشرت‌های پنبه‌ای TM-BRAND</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/60">
              <CardContent className="p-5 flex flex-col gap-3 text-sm" dir="rtl">
                <p className="text-muted-foreground">
                  اگر دوست داری در مورد موضوع خاصی در وبلاگ بنویسیم، از طریق فرم تماس یا شبکه‌های اجتماعی به ما پیام بده.
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start rounded-xl border-border/60 hover:border-primary/60 hover:bg-primary/5 gap-2"
                >
                  <Link to="/contact">
                    پیشنهاد موضوع وبلاگ
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};
