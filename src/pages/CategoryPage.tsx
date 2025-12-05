import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryInfo {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  features: string[];
}

const categoryDescriptions: Record<string, CategoryInfo> = {
  hoodies: {
    id: 'hoodies',
    name: 'هودی‌های tm-brand',
    nameEn: 'Hoodies & Sweatshirts',
    description: 'هودی‌های tm-brand با طراحی اورسایز و مدرن، ترکیبی عالی از راحتی و استایل استریت‌ویر. پارچه‌های با کیفیت پرمیوم برای تجربه‌ای بی‌نظیر.',
    features: ['فیت اورسایز و راحت', 'پارچه پنبه‌ای با کیفیت', 'طراحی منحصر به فرد', 'مناسب فصل سرد']
  },
  tshirts: {
    id: 'tshirts',
    name: 'تیشرت‌های tm-brand',
    nameEn: 'T-Shirts & Tops',
    description: 'تیشرت‌های tm-brand با طراحی‌های گرافیکی منحصر به فرد و فیت‌های متنوع. از ساده و کلاسیک تا طرح‌های استریت‌ویر برای سبک شما.',
    features: ['پنبه ۱۰۰٪ طبیعی', 'چاپ با کیفیت بالا', 'فیت‌های متنوع', 'طرح‌های اختصاصی']
  },
  pants: {
    id: 'pants',
    name: 'شلوارهای tm-brand',
    nameEn: 'Pants & Joggers',
    description: 'شلوارهای جاگر و کارگو tm-brand برای استایل روزانه و اسپرت. راحتی بی‌نظیر با ظاهری شیک و مدرن.',
    features: ['جاگر و کارگو', 'پارچه تکنولوژی', 'جیب‌های کاربردی', 'فیت راحت']
  },
  jeans: {
    id: 'jeans',
    name: 'شلوار جین‌های tm-brand',
    nameEn: 'Jeans & Denim',
    description: 'شلوار جین‌های tm-brand با فیت‌های اسلیم، ریلکس و واید. دنیم با کیفیت برای استایل کژوال روزانه.',
    features: ['دنیم باکیفیت', 'فیت‌های متنوع', 'رنگ‌بندی کلاسیک', 'دوام بالا']
  },
  shoes: {
    id: 'shoes',
    name: 'کفش‌های tm-brand',
    nameEn: 'Sneakers & Shoes',
    description: 'کفش‌های اسپرت و اسنیکر tm-brand برای استایل استریت و ورزش. راحتی و زیبایی در هر قدم.',
    features: ['تکنولوژی راحتی', 'طراحی مدرن', 'زیره با کیفیت', 'سبک و راحت']
  },
  accessories: {
    id: 'accessories',
    name: 'اکسسوری‌های tm-brand',
    nameEn: 'Accessories',
    description: 'اکسسوری‌های tm-brand شامل کلاه، کیف، کمربند و جوراب. جزئیاتی که استایل شما را کامل می‌کنند.',
    features: ['کلاه و بینی', 'کیف و کوله', 'کمربند', 'جوراب اسپرت']
  }
};

const CategoryPage = () => {
  const location = useLocation();
  const categorySlug = location.pathname.replace('/', '');
  const categoryInfo = categorySlug ? categoryDescriptions[categorySlug] : null;
  const categoryData = categories.find(c => c.id === categorySlug);

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  // Get available sizes for this category
  const availableSizes = useMemo(() => {
    const categoryProducts = products.filter(p => p.category === categorySlug);
    const sizes = new Set<string>();
    categoryProducts.forEach(p => p.sizes.forEach(s => sizes.add(s)));
    return Array.from(sizes);
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => p.category === categorySlug);

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Price filter
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    } else if (sortBy === 'bestseller') {
      filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return filtered;
  }, [categorySlug, selectedSizes, priceRange, sortBy]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const clearFilters = () => {
    setSelectedSizes([]);
    setPriceRange([0, 15000000]);
  };

  const activeFiltersCount = selectedSizes.length + (priceRange[0] > 0 || priceRange[1] < 15000000 ? 1 : 0);

  if (!categoryInfo || !categoryData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <h1 className="text-2xl font-bold mb-4">دسته‌بندی یافت نشد</h1>
          <Button asChild>
            <a href="/shop">بازگشت به فروشگاه</a>
          </Button>
        </div>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-6" dir="rtl">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSizes.map(size => (
            <Badge key={size} variant="secondary" className="gap-1">
              سایز {size}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleSize(size)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Sizes */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">سایز</h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "px-3 py-1.5 text-sm rounded-md border transition-all duration-200",
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-transparent border-border hover:border-primary/50"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">محدوده قیمت</h3>
        <Slider
          min={0}
          max={15000000}
          step={100000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="my-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0].toLocaleString('fa-IR')} تومان</span>
          <span>{priceRange[1].toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>

      {/* Clear Button */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          پاک کردن فیلترها
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Category Hero */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-dark-surface to-background">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl" dir="rtl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{categoryData.slug}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              {categoryInfo.name}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
              {categoryInfo.description}
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-3">
              {categoryInfo.features.map((feature, index) => (
                <span 
                  key={index}
                  className="px-3 py-1.5 bg-muted/50 rounded-full text-sm text-foreground/80 border border-border/50"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center justify-between mb-6" dir="rtl">
                  <h2 className="text-lg font-bold">فیلترها</h2>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary">{activeFiltersCount}</Badge>
                  )}
                </div>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6 gap-4" dir="rtl">
                <div className="flex items-center gap-4">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        فیلترها
                        {activeFiltersCount > 0 && (
                          <Badge variant="secondary" className="mr-1">{activeFiltersCount}</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <SheetHeader>
                        <SheetTitle dir="rtl">فیلترها</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <p className="text-muted-foreground text-sm hidden sm:block">
                    {filteredProducts.length} محصول
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Grid Toggle - Desktop */}
                  <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
                    <button
                      onClick={() => setGridCols(2)}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        gridCols === 2 ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(3)}
                      className={cn(
                        "p-1.5 rounded transition-colors",
                        gridCols === 3 ? "bg-muted" : "hover:bg-muted/50"
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] sm:w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">جدیدترین</SelectItem>
                      <SelectItem value="bestseller">پرفروش‌ترین</SelectItem>
                      <SelectItem value="price-low">ارزان‌ترین</SelectItem>
                      <SelectItem value="price-high">گران‌ترین</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className={cn(
                  "grid gap-4 sm:gap-6",
                  gridCols === 2 
                    ? "grid-cols-1 sm:grid-cols-2" 
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-card rounded-2xl border border-border" dir="rtl">
                  <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">محصولی یافت نشد</h3>
                  <p className="text-muted-foreground mb-6">با این فیلترها محصولی پیدا نشد</p>
                  <Button onClick={clearFilters}>
                    پاک کردن فیلترها
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;