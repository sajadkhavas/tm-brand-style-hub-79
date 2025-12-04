import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { products } from '@/data/products';
import { cn } from '@/lib/utils';

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const searchTerm = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.nameEn.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    ).slice(0, 6);
  }, [query]);

  const handleProductClick = (slug: string) => {
    navigate(`/product/${slug}`);
    onOpenChange(false);
    setQuery('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(price) + ' تومان';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4" dir="rtl">
          <Search className="h-5 w-5 text-muted-foreground ml-3" />
          <Input
            placeholder="جستجوی محصولات..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 h-14 text-lg bg-transparent"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 hover:bg-muted rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {query.trim() && (
          <div className="max-h-96 overflow-y-auto" dir="rtl">
            {filteredProducts.length > 0 ? (
              <div className="p-2">
                {filteredProducts.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.slug)}
                    className={cn(
                      "w-full flex items-center gap-4 p-3 rounded-lg",
                      "hover:bg-muted/50 transition-colors text-right"
                    )}
                  >
                    <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground truncate">
                        {product.nameEn}
                      </p>
                      <p className="text-sm text-primary font-medium mt-1">
                        {formatPrice(product.price)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>محصولی با این عنوان پیدا نشد</p>
              </div>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="p-6 text-center text-muted-foreground" dir="rtl">
            <p className="text-sm">نام محصول، دسته‌بندی یا ویژگی مورد نظر را تایپ کنید</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
