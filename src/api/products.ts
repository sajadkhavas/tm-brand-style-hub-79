/**
 * Products API - Fetches from Node.js backend managed via AdminJS
 * Note: Paths do NOT include /api prefix as VITE_API_URL already includes it
 */
import { Product, Category } from '@/types';
import { apiClient, ApiResponse } from './client';

export interface ProductQueryParams {
  category?: string;
  gender?: string;
  minPrice?: number;
  maxPrice?: number;
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  search?: string;
  sort?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

interface BackendProduct {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  images: string[];
  sizes: string[];
  colors: Array<{ name: string; hex: string }>;
  stock: number;
  stockStatus: 'inStock' | 'lowStock' | 'outOfStock';
  isNew: boolean;
  isBestseller: boolean;
  isFeatured: boolean;
  isActive: boolean;
  gender: 'men' | 'women' | 'unisex';
  material?: string;
  weight?: string;
  seoTitle?: string;
  seoDescription?: string;
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    nameEn: string;
    slug: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface BackendCategory {
  id: string;
  name: string;
  nameEn: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

/**
 * Transform backend product to frontend Product type
 */
const transformProduct = (item: BackendProduct): Product => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  nameEn: item.nameEn || '',
  description: item.description || '',
  longDescription: item.shortDescription || '',
  price: Number(item.price),
  compareAtPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
  gender: item.gender,
  sizes: item.sizes || [],
  availableSizes: item.sizes || [],
  colors: item.colors || [],
  images: item.images || [],
  isNew: item.isNew,
  isBestSeller: item.isBestseller,
  isFeatured: item.isFeatured,
  stockStatus: item.stockStatus,
  inStock: item.stockStatus !== 'outOfStock',
  categoryId: item.categoryId || item.category?.id || '',
  category: item.category?.slug || '',
  materials: item.material || '',
  seoTitle: item.seoTitle || '',
  seoDescription: item.seoDescription || '',
});

/**
 * Transform backend category to frontend Category type
 */
const transformCategory = (item: BackendCategory): Category => ({
  id: item.id,
  slug: item.slug,
  name: item.name,
  description: item.description,
});

/**
 * Get all products with optional filters
 */
export const getProducts = async (params?: ProductQueryParams): Promise<Product[]> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.category) queryParams.set('category', params.category);
    if (params?.gender) queryParams.set('gender', params.gender);
    if (params?.minPrice) queryParams.set('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.set('maxPrice', params.maxPrice.toString());
    if (params?.isNew) queryParams.set('isNew', 'true');
    if (params?.isBestseller) queryParams.set('isBestseller', 'true');
    if (params?.isFeatured) queryParams.set('isFeatured', 'true');
    if (params?.search) queryParams.set('search', params.search);
    if (params?.sort) queryParams.set('sort', params.sort);
    if (params?.order) queryParams.set('order', params.order);
    if (params?.page) queryParams.set('page', params.page.toString());
    if (params?.limit) queryParams.set('limit', params.limit.toString());

    const query = queryParams.toString();
    // Note: NO /api prefix - VITE_API_URL already includes it
    const path = query ? `/products?${query}` : '/products';
    
    const response = await apiClient.get<ApiResponse<BackendProduct[]>>(path);
    return (response.data || []).map(transformProduct);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
};

/**
 * Get single product by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendProduct>>(`/products/${slug}`);
    return response.data ? transformProduct(response.data) : undefined;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return undefined;
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendProduct[]>>('/products/featured');
    return (response.data || []).map(transformProduct);
  } catch (error) {
    console.error('Failed to fetch featured products:', error);
    return [];
  }
};

/**
 * Get new arrivals
 */
export const getNewProducts = async (): Promise<Product[]> => {
  return getProducts({ isNew: true, limit: 8 });
};

/**
 * Get bestseller products
 */
export const getBestsellerProducts = async (): Promise<Product[]> => {
  return getProducts({ isBestseller: true, limit: 8 });
};

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendCategory[]>>('/categories');
    return (response.data || []).map(transformCategory);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
};

/**
 * Get single category by slug
 */
export const getCategoryBySlug = async (slug: string): Promise<Category | undefined> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendCategory>>(`/categories/${slug}`);
    return response.data ? transformCategory(response.data) : undefined;
  } catch (error) {
    console.error(`Failed to fetch category ${slug}:`, error);
    return undefined;
  }
};
