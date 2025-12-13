import { useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '@/components/product/ProductCard';
import { getProducts, getCategories } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Sparkles, Package, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollReveal } from '@/components/animations/ScrollReveal';

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  
  // Get category slug from params or from path (for legacy routes)
  const categorySlug = slug || location.pathname.replace('/', '');

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  });

  // Fetch products for this category
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'category', categorySlug],
    queryFn: () => getProducts({ category: categorySlug }),
    enabled: Boolean(categorySlug)
  });

  // Find current category
  const category = categories.find(c => c.slug === categorySlug);

  // Get available sizes from products
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    products.forEach(p => (p.sizes || p.availableSizes || []).forEach(s => sizes.add(s)));
    return Array.from(sizes);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        (p.sizes || p.availableSizes || []).some(size => selectedSizes.includes(size))
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
  }, [products, selectedSizes, priceRange, sortBy]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen py-20" dir="rtl">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-12" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))}
          </div>
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
            <Badge key={size} variant="secondary" className="gap-1 bg-primary/10 text-primary">
              سایز {size}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleSize(size)} />
            </Badge>
          ))}
        </div>
      )}

      {/* Sizes */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">سایز</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-lg border-2 transition-all duration-200",
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
      )}

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
          <span className="bg-muted/50 px-3 py-1.5 rounded-lg">{priceRange[0].toLocaleString('fa-IR')} تومان</span>
          <span className="bg-muted/50 px-3 py-1.5 rounded-lg">{priceRange[1].toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>

      {/* Clear Button */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full rounded-xl" onClick={clearFilters}>
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
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-primary transition-colors">خانه</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-primary transition-colors">فروشگاه</Link>
              <span>/</span>
              <span className="text-foreground">{category?.name || categorySlug}</span>
            </div>
            
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">{categorySlug}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 leading-tight">
              {category?.name || categorySlug}
            </h1>
            
            {category?.description && (
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
                {category.description}
              </p>
            )}
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span className="font-medium">{products.length} محصول</span>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      </section>

      {/* Products Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28">
                <div className="glass-premium rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6" dir="rtl">
                    <h2 className="text-lg font-bold">فیلترها</h2>
                    {activeFiltersCount > 0 && (
                      <Badge className="bg-primary/10 text-primary">{activeFiltersCount}</Badge>
                    )}
                  </div>
                  <FilterContent />
                </div>
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
                      <Button variant="outline" className="lg:hidden gap-2 h-12 rounded-xl">
                        <SlidersHorizontal className="h-4 w-4" />
                        فیلترها
                        {activeFiltersCount > 0 && (
                          <Badge className="mr-1 bg-primary/10 text-primary">{activeFiltersCount}</Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80 glass-strong">
                      <SheetHeader>
                        <SheetTitle dir="rtl" className="text-xl">فیلترها</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>

                  <p className="text-muted-foreground text-sm hidden sm:flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    {filteredProducts.length} محصول
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Grid Toggle - Desktop */}
                  <div className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-xl">
                    <button
                      onClick={() => setGridCols(2)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        gridCols === 2 ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                      )}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setGridCols(3)}
                      className={cn(
                        "p-2 rounded-lg transition-all",
                        gridCols === 3 ? "bg-primary text-primary-foreground" : "hover:bg-muted/50"
                      )}
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] sm:w-[160px] h-12 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="newest" className="rounded-lg">جدیدترین</SelectItem>
                      <SelectItem value="bestseller" className="rounded-lg">پرفروش‌ترین</SelectItem>
                      <SelectItem value="price-low" className="rounded-lg">ارزان‌ترین</SelectItem>
                      <SelectItem value="price-high" className="rounded-lg">گران‌ترین</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Products Grid */}
              {filteredProducts.length > 0 ? (
                <div className={cn(
                  "grid gap-6",
                  gridCols === 2 
                    ? "grid-cols-1 sm:grid-cols-2" 
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                )}>
                  {filteredProducts.map((product, index) => (
                    <ScrollReveal key={product.id} animation="fade-up" delay={index * 50}>
                      <ProductCard product={product} />
                    </ScrollReveal>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24 glass-premium rounded-3xl" dir="rtl">
                  <div className="w-24 h-24 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">محصولی یافت نشد</h3>
                  <p className="text-muted-foreground mb-8 text-lg">با این فیلترها محصولی پیدا نشد</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={clearFilters} className="h-12 px-8 rounded-xl">
                      پاک کردن فیلترها
                    </Button>
                    <Button asChild variant="outline" className="h-12 px-8 rounded-xl">
                      <Link to="/shop" className="flex items-center gap-2">
                        همه محصولات
                        <ArrowLeft className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
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
