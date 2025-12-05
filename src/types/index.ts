export type StockStatus = 'inStock' | 'lowStock' | 'outOfStock';

export interface ColorOption {
  name: string;
  hex: string;
}

export interface ProductVariant {
  id?: string;
  size?: string;
  color?: string;
  stockStatus?: StockStatus;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  description: string;
  longDescription?: string;
  images: string[];
  price: number;
  compareAtPrice?: number;
  categoryId?: string;
  category?: string;
  tags?: string[];
  sizes?: string[];
  availableSizes?: string[];
  colors: ColorOption[];
  variants?: ProductVariant[];
  specifications?: Array<{ label: string; value: string }>;
  features?: string[];
  sizeGuide?: string;
  materials?: string;
  gender?: 'men' | 'women' | 'unisex';
  stockStatus?: StockStatus;
  inStock?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFeatured?: boolean;
  isOnSale?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
}

export interface CartItemVariant {
  size?: string;
  color?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productSnapshot: Pick<Product, 'id' | 'name' | 'slug' | 'images' | 'price' | 'compareAtPrice' | 'colors' | 'sizes'>;
  variant?: CartItemVariant;
  quantity: number;
  priceAtAddTime: number;
}

export interface Address {
  id: string;
  receiverName: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  addressLine: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  addresses?: Address[];
}

export interface OrderItemSnapshot extends CartItem {
  productSnapshot: CartItem['productSnapshot'] & { description?: string };
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItemSnapshot[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  tags?: string[];
  publishedAt: string;
  readTimeMinutes: number;
}
