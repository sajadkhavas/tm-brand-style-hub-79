import { products, categories } from '@/data/products';
import { Product } from '@/types';

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export interface ProductQueryParams {
  categoryId?: string;
  size?: string;
  tag?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

export const getProducts = async (params?: ProductQueryParams): Promise<Product[]> => {
  await delay();
  let result = [...products];

  if (params?.categoryId) {
    result = result.filter(p => p.categoryId === params.categoryId || p.category === params.categoryId);
  }

  if (params?.size) {
    result = result.filter(p => (p.sizes || p.availableSizes)?.includes(params.size!));
  }

  if (params?.sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (params?.sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
};

export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  await delay();
  return products.find(p => p.slug === slug);
};

export const getFeaturedProducts = async (): Promise<Product[]> => {
  await delay();
  return products.filter(p => p.isFeatured || p.isBestSeller).slice(0, 8);
};

export const getCategories = async () => {
  await delay();
  return categories;
};
