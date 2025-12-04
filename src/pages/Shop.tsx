import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ProductCard } from '@/components/product/ProductCard';
import { products, categories } from '@/data/products';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SlidersHorizontal, X, Grid3X3, LayoutGrid, Sparkles, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36', '38', '39', '40', '41', '42', '43', '44', '45', '46'];
const genders = [
  { id: 'men', name: 'مردانه' },
  { id: 'women', name: 'زنانه' },
  { id: 'unisex', name: 'یونیسکس' },
];

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const filterParam = searchParams.get('filter');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    categoryParam ? [categoryParam] : []
  );
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 15000000]);
  const [sortBy, setSortBy] = useState('newest');
  const [gridCols, setGridCols] = useState<2 | 3>(3);

  const availableSizes = useMemo(() => {
    const allSizes = new Set<string>();
    products.forEach(p => p.sizes.forEach(s => allSizes.add(s)));
    return sizes.filter(s => allSizes.has(s));
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p => selectedCategories.includes(p.category));
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.sizes.some(size => selectedSizes.includes(size))
      );
    }

    if (selectedGenders.length > 0) {
      filtered = filtered.filter(p => selectedGenders.includes(p.gender));
    }

    if (filterParam === 'new') {
      filtered = filtered.filter(p => p.isNew);
    } else if (filterParam === 'bestseller') {
      filtered = filtered.filter(p => p.isBestSeller);
    }

    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

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
  }, [selectedCategories, selectedSizes, selectedGenders, priceRange, sortBy, filterParam]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleGender = (genderId: string) => {
    setSelectedGenders(prev =>
      prev.includes(genderId)
        ? prev.filter(g => g !== genderId)
        : [...prev, genderId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setSelectedGenders([]);
    setPriceRange([0, 15000000]);
  };

  const activeFiltersCount = selectedCategories.length + selectedSizes.length + selectedGenders.length + 
    (priceRange[0] > 0 || priceRange[1] < 15000000 ? 1 : 0);

  const FilterContent = () => (
    <div className="space-y-8" dir="rtl">
      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(cat => {
            const category = categories.find(c => c.id === cat);
            return (
              <Badge key={cat} variant="secondary" className="gap-2 py-1.5 px-3 rounded-lg bg-primary/10 text-primary border-primary/30">
                {category?.name}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => toggleCategory(cat)} />
              </Badge>
            );
          })}
          {selectedSizes.map(size => (
            <Badge key={size} variant="secondary" className="gap-2 py-1.5 px-3 rounded-lg bg-primary/10 text-primary border-primary/30">
              سایز {size}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => toggleSize(size)} />
            </Badge>
          ))}
          {selectedGenders.map(g => {
            const gender = genders.find(gen => gen.id === g);
            return (
              <Badge key={g} variant="secondary" className="gap-2 py-1.5 px-3 rounded-lg bg-primary/10 text-primary border-primary/30">
                {gender?.name}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => toggleGender(g)} />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Categories */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-lg">دسته‌بندی</h3>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center gap-3 group">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => toggleCategory(category.id)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={category.id} className="cursor-pointer flex-1 group-hover:text-primary transition-colors">
                {category.name}
              </Label>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                {products.filter(p => p.category === category.id).length}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-lg">جنسیت</h3>
        <div className="space-y-3">
          {genders.map((gender) => (
            <div key={gender.id} className="flex items-center gap-3 group">
              <Checkbox
                id={`gender-${gender.id}`}
                checked={selectedGenders.includes(gender.id)}
                onCheckedChange={() => toggleGender(gender.id)}
                className="border-border/50 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={`gender-${gender.id}`} className="cursor-pointer group-hover:text-primary transition-colors">
                {gender.name}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-lg">سایز</h3>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                "px-4 py-2 text-sm rounded-xl border-2 font-medium transition-all duration-300",
                selectedSizes.includes(size)
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-transparent border-border/50 hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground text-lg">محدوده قیمت</h3>
        <Slider
          min={0}
          max={15000000}
          step={100000}
          value={priceRange}
          onValueChange={setPriceRange}
          className="my-6"
        />
        <div className="flex justify-between text-sm">
          <span className="bg-muted/50 px-3 py-1.5 rounded-lg text-muted-foreground">{priceRange[0].toLocaleString('fa-IR')} تومان</span>
          <span className="bg-muted/50 px-3 py-1.5 rounded-lg text-muted-foreground">{priceRange[1].toLocaleString('fa-IR')} تومان</span>
        </div>
      </div>

      {/* Clear Button */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" className="w-full h-12 rounded-xl" onClick={clearFilters}>
          پاک کردن فیلترها
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen py-8 md:py-12 relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12" dir="rtl">
          <Badge className="mb-4 px-4 py-2 bg-primary/10 text-primary border-primary/30">
            <Sparkles className="h-4 w-4 ml-2" />
            {filterParam === 'new' && 'جدیدترین‌ها'}
            {filterParam === 'bestseller' && 'پرفروش‌ها'}
            {!filterParam && 'همه محصولات'}
          </Badge>
          <h1 className="text-foreground mb-4">فروشگاه</h1>
          <p className="text-muted-foreground text-lg">
            {filterParam === 'new' && 'جدیدترین محصولات اضافه شده به TM-BRAND'}
            {filterParam === 'bestseller' && 'محبوب‌ترین انتخاب‌های مشتریان ما'}
            {!filterParam && 'مجموعه کامل محصولات TM-BRAND'}
          </p>
        </div>

        <div className="flex gap-8 lg:gap-12">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-28">
              <div className="glass-premium rounded-2xl p-6">
                <div className="flex items-center justify-between mb-8" dir="rtl">
                  <h2 className="text-xl font-bold font-display">فیلترها</h2>
                  {activeFiltersCount > 0 && (
                    <Badge className="bg-primary/10 text-primary border-primary/30">{activeFiltersCount}</Badge>
                  )}
                </div>
                <FilterContent />
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 gap-4 flex-wrap" dir="rtl">
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
                  <SheetContent side="right" className="w-80 glass-strong border-border/30">
                    <SheetHeader>
                      <SheetTitle dir="rtl" className="font-display text-xl">فیلترها</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 overflow-y-auto max-h-[calc(100vh-120px)]">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Package className="h-5 w-5" />
                  <span className="font-medium">{filteredProducts.length} محصول</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Grid Toggle - Desktop */}
                <div className="hidden md:flex items-center gap-1 bg-muted/30 p-1 rounded-xl">
                  <button
                    onClick={() => setGridCols(2)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      gridCols === 2 ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted/50"
                    )}
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setGridCols(3)}
                    className={cn(
                      "p-2 rounded-lg transition-all duration-300",
                      gridCols === 3 ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-muted/50"
                    )}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[160px] h-12 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="glass-strong border-border/30 rounded-xl">
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
                  <div key={product.id} className="opacity-0 animate-fade-up" style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 glass-premium rounded-3xl" dir="rtl">
                <div className="w-24 h-24 bg-muted/30 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-display">محصولی یافت نشد</h3>
                <p className="text-muted-foreground mb-8 text-lg">با این فیلترها محصولی پیدا نشد</p>
                <Button onClick={clearFilters} className="h-12 px-8 rounded-xl">
                  پاک کردن فیلترها
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;