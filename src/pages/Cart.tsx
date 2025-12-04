import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCart();

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  const generateWhatsAppMessage = () => {
    const orderDetails = items.map((item, index) => 
      `${index + 1}. ${item.product.name}\n   سایز: ${item.selectedSize} | رنگ: ${item.selectedColor} | تعداد: ${item.quantity}\n   قیمت: ${formatPrice(item.product.price * item.quantity)}`
    ).join('\n\n');

    const total = formatPrice(getTotalPrice());
    const message = `سلام! می‌خواهم سفارش زیر را ثبت کنم:\n\n${orderDetails}\n\n💰 جمع کل: ${total}`;
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = '989123456789'; // Replace with actual WhatsApp number
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">سبد خرید شما خالی است</h1>
          <p className="text-muted-foreground mb-8">محصولاتی را که می‌پسندید به سبد خرید اضافه کنید</p>
          <Button asChild size="lg">
            <Link to="/shop">مشاهده محصولات</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-foreground mb-8" dir="rtl">سبد خرید</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4" dir="rtl">
                    {/* Image */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 object-cover rounded-lg bg-muted"
                    />

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        سایز: {item.selectedSize} | رنگ: {item.selectedColor}
                      </p>
                      <p className="text-primary font-bold">
                        {formatPrice(item.product.price)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.product.id, item.selectedSize, item.selectedColor)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6" dir="rtl">
                <h2 className="text-2xl font-bold mb-6">خلاصه سفارش</h2>
                
                <div className="space-y-3 mb-6 pb-6 border-b border-border">
                  <div className="flex justify-between text-muted-foreground">
                    <span>تعداد اقلام:</span>
                    <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>هزینه ارسال:</span>
                    <span className="text-primary">رایگان</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>جمع کل:</span>
                  <span className="text-primary">{formatPrice(getTotalPrice())}</span>
                </div>

                <div className="space-y-3">
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={handleWhatsAppOrder}
                  >
                    ثبت سفارش از طریق واتساپ
                  </Button>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/checkout">ادامه به تسویه حساب</Link>
                  </Button>
                  <Button asChild variant="ghost" size="lg" className="w-full">
                    <Link to="/shop">ادامه خرید</Link>
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  با کلیک بر روی دکمه واتساپ، جزئیات سفارش شما برای ما ارسال می‌شود
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
