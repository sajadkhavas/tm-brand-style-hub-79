import { Link } from 'react-router-dom';
import { Product } from '@/data/products';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ShoppingCart, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' تومان';
  };

  return (
    <Link 
      to={`/product/${product.slug}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="relative overflow-hidden border-border/30 bg-card/50 backdrop-blur-sm hover:border-primary/40 transition-all duration-500 hover-lift">
        {/* Glow Effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t from-primary/10 via-transparent to-transparent transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0"
        )} />
        
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full transition-all duration-700 group-hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
          
          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsLiked(!isLiked);
            }}
            className={cn(
              "absolute top-4 left-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300",
              isLiked 
                ? "bg-destructive/90 text-destructive-foreground" 
                : "bg-background/50 text-foreground hover:bg-background/80"
            )}
          >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
          </button>
          
          {/* Quick Actions */}
          <div className={cn(
            "absolute bottom-6 left-4 right-4 flex gap-2 transition-all duration-500",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}>
            <Button 
              size="sm" 
              className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
              onClick={(e) => e.preventDefault()}
            >
              <ShoppingCart className="h-4 w-4 ml-2" />
              افزودن به سبد
            </Button>
            <Button 
              size="sm" 
              variant="secondary"
              className="h-12 w-12 rounded-xl backdrop-blur-md bg-secondary/80"
              onClick={(e) => e.preventDefault()}
            >
              <Eye className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2" dir="rtl">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground shadow-lg shadow-primary/30 font-medium">
                جدید
              </Badge>
            )}
            {product.isBestSeller && (
              <Badge variant="secondary" className="shadow-lg backdrop-blur-md bg-secondary/80 font-medium">
                پرفروش
              </Badge>
            )}
            {product.isOnSale && (
              <Badge className="bg-destructive text-destructive-foreground shadow-lg font-medium">
                حراج
              </Badge>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="p-5 relative z-10" dir="rtl">
          {/* Name */}
          <h3 className="font-semibold text-lg text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1 font-display">
            {product.nameEn}
          </p>
          
          {/* Price & Colors */}
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
            </div>
            
            {/* Color Swatches */}
            <div className="flex gap-1.5">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border-2 border-border/50 shadow-sm transition-all duration-300 hover:scale-125 hover:border-primary/50"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full bg-muted border-2 border-border/50 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground font-medium">+{product.colors.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};