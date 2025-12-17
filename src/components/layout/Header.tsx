import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Menu, X, ShoppingCart, Search, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/cart';
import { cn } from '@/lib/utils';
import { SearchDialog } from '@/components/search/SearchDialog';
import { getCategories } from '@/api/products';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Fallback categories in case API fails
const fallbackCategories = [
  { slug: 'hoodie', name: 'هودی و سویشرت', icon: '🧥' },
  { slug: 'tshirt', name: 'تیشرت', icon: '👕' },
  { slug: 'pants', name: 'شلوار', icon: '👖' },
  { slug: 'jeans', name: 'شلوار جین', icon: '👖' },
  { slug: 'shoes', name: 'کفش', icon: '👟' },
  { slug: 'accessories', name: 'اکسسوری', icon: '🎒' },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems } = useCartStore();
  const location = useLocation();

  // Fetch categories from API
  const { data: apiCategories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Use API categories or fallback
  const categories = apiCategories.length > 0 ? apiCategories : fallbackCategories;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;
  const isCategoryActive = (slug: string) => location.pathname === `/category/${slug}`;

  const mainNavLinks = [
    { path: '/', label: 'خانه' },
    { path: '/shop', label: 'فروشگاه' },
  ];

  const secondaryNavLinks = [
    { path: '/blog', label: 'وبلاگ' },
    { path: '/about', label: 'درباره ما' },
    { path: '/contact', label: 'تماس' },
  ];

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled 
            ? "glass-strong shadow-lg shadow-background/20 border-b border-border/30" 
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link 
              to="/" 
              className="group flex items-center"
              dir="ltr"
            >
              <span className="text-2xl md:text-3xl font-extrabold text-primary transition-all duration-300 group-hover:text-primary/80 tracking-tight font-display">
                TM
              </span>
              <span className="text-xl md:text-2xl font-bold text-foreground transition-all duration-300 group-hover:text-foreground/80 font-display">
                -BRAND
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1" dir="rtl">
              {mainNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive(link.path)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              ))}

              {/* Categories Dropdown - Dynamic from API */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className={cn(
                      "px-5 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2",
                      categories.some(c => isCategoryActive(c.slug))
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    دسته‌بندی‌ها
                    {categoriesLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 p-2 glass-strong border-border/30 rounded-2xl">
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category.slug}
                      asChild
                      className="group rounded-xl focus:bg-primary/10 hover:bg-primary/5 transition-colors duration-200"
                    >
                      <Link
                        to={`/category/${category.slug}`}
                        className={cn(
                          "flex items-center gap-3 cursor-pointer py-3 px-4 text-foreground/80 group-hover:text-primary transition-colors duration-200",
                          isCategoryActive(category.slug) && "text-primary"
                        )}
                      >
                        <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                          {category.icon || '📦'}
                        </span>
                        <span className="font-medium">{category.name}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {secondaryNavLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  aria-current={isActive(link.path) ? 'page' : undefined}
                  className={cn(
                    "relative px-5 py-2.5 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    isActive(link.path)
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  )}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <Button 
                variant="ghost" 
                size="icon"
                className="rounded-xl hover:bg-muted/50"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart */}
              <Link to="/cart">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className={cn(
                    "relative rounded-xl hover:bg-muted/50",
                    totalItems > 0 && "text-primary"
                  )}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-primary/30 animate-scale-up">
                      {totalItems > 9 ? '9+' : totalItems}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl hover:bg-muted/50"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={cn(
              "lg:hidden overflow-hidden transition-all duration-500 ease-out",
              mobileMenuOpen ? "max-h-[600px] opacity-100 pb-6" : "max-h-0 opacity-0"
            )}
          >
            <nav className="pt-4 border-t border-border/30" dir="rtl">
              <div className="flex flex-col gap-1">
                {mainNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={cn(
                      "px-4 py-3 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                      isActive(link.path)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile Categories */}
                <div className="px-4 py-3 text-sm font-semibold text-muted-foreground">دسته‌بندی‌ها</div>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      to={`/category/${category.slug}`}
                      className={cn(
                        "px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-3",
                        isCategoryActive(category.slug)
                          ? "text-primary bg-primary/10"
                          : "text-foreground/70 hover:text-primary hover:bg-primary/5"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span>{category.icon || '📦'}</span>
                      <span className="text-sm">{category.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="h-px bg-border/30 my-3" />

                {secondaryNavLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    aria-current={isActive(link.path) ? 'page' : undefined}
                    className={cn(
                      "px-4 py-3 rounded-xl font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
                      isActive(link.path)
                        ? "text-primary bg-primary/10"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Search Dialog */}
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};
