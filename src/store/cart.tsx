import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  addToCart: (product: Product, variant: { size?: string; color?: string }, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const buildCartItem = (product: Product, variant: { size?: string; color?: string }, quantity: number): CartItem => ({
  id: `${product.id}-${variant.size || 'onesize'}-${variant.color || 'default'}`,
  productId: product.id,
  productSnapshot: {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    colors: product.colors,
    sizes: product.sizes || product.availableSizes,
  },
  variant,
  quantity,
  priceAtAddTime: product.price,
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, variant: { size?: string; color?: string }, quantity = 1) => {
    setItems(prev => {
      const candidateId = `${product.id}-${variant.size || 'onesize'}-${variant.color || 'default'}`;
      const existing = prev.find(item => item.id === candidateId);
      if (existing) {
        return prev.map(item =>
          item.id === candidateId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, buildCartItem(product, variant, quantity)];
    });
  };

  const removeItem = (id: string) => setItems(prev => prev.filter(item => item.id !== id));

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems(prev => prev.map(item => (item.id === id ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.priceAtAddTime * item.quantity, 0);
    return { totalItems, totalPrice };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, removeItem, updateQuantity, clearCart, ...totals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCartStore = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartStore must be used inside CartProvider');
  return ctx;
};
