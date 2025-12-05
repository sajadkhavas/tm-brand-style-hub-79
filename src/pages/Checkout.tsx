import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

const Checkout = () => {
  const { items, totalPrice } = useCartStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // This is a placeholder - in future, integrate with payment gateway
    console.log('Checkout submitted:', formData);
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8" dir="rtl">تسویه حساب</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle dir="rtl">اطلاعات ارسال</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className="mb-4">در حال حاضر این صفحه در حال توسعه است</Badge>
                <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">نام و نام خانوادگی *</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">شماره تماس *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">ایمیل</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">آدرس کامل *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      required
                      dir="rtl"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">شهر *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        required
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <Label htmlFor="postalCode">کد پستی *</Label>
                      <Input
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                        required
                        dir="rtl"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">یادداشت (اختیاری)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      placeholder="توضیحات اضافی درباره سفارش..."
                      dir="rtl"
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      این صفحه در آینده به درگاه پرداخت متصل خواهد شد. در حال حاضر لطفاً از دکمه واتساپ در صفحه سبد خرید استفاده کنید.
                    </p>
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled>
                    پرداخت (به زودی فعال می‌شود)
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle dir="rtl">خلاصه سفارش</CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <img
                        src={item.productSnapshot.images[0]}
                        alt={item.productSnapshot.name}
                        className="w-16 h-16 object-cover rounded bg-muted"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{item.productSnapshot.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.variant?.size && <>سایز: {item.variant.size}</>} {item.variant?.color && <>| رنگ: {item.variant.color}</>} | تعداد: {item.quantity}
                        </p>
                        <p className="text-sm text-primary font-semibold">
                          {formatPrice(item.priceAtAddTime * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">جمع محصولات:</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">هزینه ارسال:</span>
                    <span className="text-primary">رایگان</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                    <span>جمع کل:</span>
                    <span className="text-primary">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
