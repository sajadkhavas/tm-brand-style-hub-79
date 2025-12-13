import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductBySlug, getProducts } from '@/api/products';
import { useCartStore } from '@/store/cart';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product/ProductCard';
import { useToast } from '@/hooks/use-toast';
import { ChevronRight, CheckCircle2, Truck, RotateCcw, Minus, Plus, Package, Ruler } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Autoplay from 'embla-carousel-autoplay';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const { data: product, isLoading } = useQuery<Product | undefined>({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug || ''),
    enabled: Boolean(slug)
  });
  const { data: relatedProducts } = useQuery<Product[]>({
    queryKey: ['related', product?.categoryId || product?.category],
    queryFn: () => getProducts({ category: product?.categoryId || product?.category }),
    enabled: Boolean(product)
  });
  const relatedList = relatedProducts || [];
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center space-y-2">
          <div className="animate-pulse h-6 w-32 bg-muted rounded-full mx-auto" />
          <p className="text-muted-foreground">در حال بارگذاری محصول...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <h1 className="text-2xl font-bold mb-4">محصول یافت نشد</h1>
          <Button asChild>
            <Link to="/shop">بازگشت به فروشگاه</Link>
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "خطا",
        description: "لطفاً سایز را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }
    if (!selectedColor) {
      toast({
        title: "خطا",
        description: "لطفاً رنگ را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    addToCart(product, { size: selectedSize, color: selectedColor }, quantity);
    toast({
      title: "افزودن به سبد خرید",
      description: `${product.name} به سبد خرید اضافه شد`,
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-8" dir="rtl">
          <Link to="/" className="text-muted-foreground hover:text-primary">
            خانه
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/shop" className="text-muted-foreground hover:text-primary">
            فروشگاه
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Product Detail */}
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery with 360° Carousel */}
          <div className="space-y-4">
            {/* Main Image Carousel */}
            <Carousel 
              className="w-full"
              plugins={[
                Autoplay({
                  delay: 3000,
                  stopOnInteraction: true,
                })
              ]}
              opts={{
                loop: true,
                align: "start",
              }}
            >
              <CarouselContent>
                {product.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      <img
                        src={image}
                        alt={`${product.name} - نمای ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>

            {/* Thumbnail Navigation */}
            <div className="grid grid-cols-6 gap-2">
              {product.images.slice(0, 6).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                    selectedImageIndex === index 
                      ? 'border-primary scale-105' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <img
                    src={image}
                    alt={`thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* 360° Badge */}
            {product.images.length > 8 && (
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground" dir="rtl">
                <Package className="h-4 w-4" />
                <span>نمای ۳۶۰ درجه محصول</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div dir="rtl">
            <div className="flex gap-2 mb-4">
              {product.isNew && <Badge>جدید</Badge>}
              {product.isBestSeller && <Badge variant="secondary">پرفروش</Badge>}
            </div>

            <h1 className="text-4xl font-bold text-foreground mb-2">{product.name}</h1>
            <p className="text-lg text-muted-foreground mb-6">{product.nameEn}</p>
            
            <div className="text-3xl font-bold text-primary mb-8">
              {formatPrice(product.price)}
            </div>

            <p className="text-muted-foreground mb-8">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">سایز</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size)}
                    className="min-w-[60px]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-6">
              <h3 className="font-semibold mb-3">رنگ</h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`group relative w-12 h-12 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? 'border-primary scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor === color.name && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 bg-primary rounded-full" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <h3 className="font-semibold mb-3">تعداد</h3>
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Add to Cart */}
            <Button size="lg" className="w-full mb-6" onClick={handleAddToCart}>
              افزودن به سبد خرید
            </Button>

            {/* Features */}
            <div className="space-y-3 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-sm">محصول اورجینال</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <span className="text-sm">ارسال سریع به سراسر کشور</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span className="text-sm">۷ روز ضمانت بازگشت</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mb-20" dir="rtl">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="description">توضیحات کامل</TabsTrigger>
              <TabsTrigger value="features">ویژگی‌ها</TabsTrigger>
              <TabsTrigger value="specs">مشخصات فنی</TabsTrigger>
              <TabsTrigger value="size">راهنمای سایز</TabsTrigger>
            </TabsList>

            {/* Long Description Tab */}
            <TabsContent value="description" className="space-y-4">
              <div className="prose prose-lg max-w-none">
                {product.longDescription ? (
                  product.longDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Features Tab */}
            <TabsContent value="features">
              <div className="bg-muted/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                  ویژگی‌های کلیدی محصول
                </h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="space-y-3">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">
                    این محصول با کیفیت بالا و طراحی مدرن برای راحتی و استایل شما ساخته شده است.
                  </p>
                )}
              </div>
            </TabsContent>

            {/* Specifications Tab */}
            <TabsContent value="specs">
              <div className="bg-muted/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Package className="h-6 w-6 text-primary" />
                  جزئیات و مشخصات فنی
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between items-center p-4 bg-background rounded-lg">
                        <span className="font-semibold text-foreground">{spec.label}:</span>
                        <span className="text-muted-foreground">{spec.value}</span>
                      </div>
                    ))
                  ) : (
                    <>
                      {product.materials && (
                        <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                          <span className="font-semibold text-foreground">جنس:</span>
                          <span className="text-muted-foreground">{product.materials}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                        <span className="font-semibold text-foreground">جنسیت:</span>
                        <span className="text-muted-foreground">
                          {product.gender === 'men' ? 'مردانه' : product.gender === 'women' ? 'زنانه' : 'یونیسکس'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-background rounded-lg">
                        <span className="font-semibold text-foreground">دسته‌بندی:</span>
                        <span className="text-muted-foreground">{product.category}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Size Guide Tab */}
            <TabsContent value="size">
              <div className="bg-muted/30 rounded-lg p-8">
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <Ruler className="h-6 w-6 text-primary" />
                  راهنمای انتخاب سایز
                </h3>
                {product.sizeGuide ? (
                  <div className="prose prose-lg max-w-none">
                    {product.sizeGuide.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      لطفاً قبل از خرید، سایز خود را با دقت انتخاب کنید. در صورت نیاز به راهنمایی، با پشتیبانی تماس بگیرید.
                    </p>
                    <div className="bg-background rounded-lg p-6">
                      <h4 className="font-bold mb-3">سایزهای موجود:</h4>
                      <div className="flex flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <span key={size} className="px-4 py-2 bg-muted rounded-md font-semibold">
                            {size}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedList.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-8" dir="rtl">
              محصولات مشابه
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedList.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
