import { Product } from '@/types';
import { strapiClient, STRAPI_URL } from './strapi';
import { products as localProducts, categories as localCategories } from '@/data/products';

// Flag to use Strapi or local data (set to true when Strapi is ready)
const USE_STRAPI = import.meta.env.VITE_USE_STRAPI === 'true';

export interface ProductQueryParams {
  categoryId?: string;
  size?: string;
  tag?: string;
  sort?: 'price-asc' | 'price-desc' | 'newest' | 'popular';
}

/**
 * Transform Strapi product to our Product type
 */
const transformStrapiProduct = (item: any): Product => {
  const attrs = item.attributes;
  return {
    id: item.id.toString(),
    slug: attrs.slug,
    name: attrs.name,
    nameEn: attrs.nameEn || '',
    description: attrs.description || '',
    longDescription: attrs.longDescription || '',
    price: attrs.price,
    compareAtPrice: attrs.compareAtPrice || undefined,
    gender: attrs.gender || 'unisex',
    sizes: attrs.sizes || [],
    availableSizes: attrs.sizes || [],
    colors: attrs.colors || [],
    images: attrs.images?.data?.map((img: any) => 
      strapiClient.getImageUrl(img.attributes.url)
    ) || [],
    isNew: attrs.isNew || false,
    isBestSeller: attrs.isBestSeller || false,
    isFeatured: attrs.isFeatured || false,
    features: attrs.features || [],
    specifications: attrs.specifications || [],
    materials: attrs.materials || '',
    sizeGuide: attrs.sizeGuide || '',
    categoryId: attrs.category?.data?.id?.toString() || '',
    category: attrs.category?.data?.attributes?.slug || '',
    seoTitle: attrs.seoTitle || '',
    seoDescription: attrs.seoDescription || '',
    seoKeywords: attrs.seoKeywords || [],
  };
};

/**
 * Get all products with optional filters
 */
export const getProducts = async (params?: ProductQueryParams): Promise<Product[]> => {
  if (!USE_STRAPI) {
    // Use local data
    let result = [...localProducts];

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
  }

  // Use Strapi
  try {
    let query = 'populate=*';
    
    if (params?.categoryId) {
      query += `&filters[category][slug][$eq]=${params.categoryId}`;
    }
    if (params?.size) {
      query += `&filters[sizes][$contains]=${params.size}`;
    }
    
    const data = await strapiClient.get<any[]>(`/products?${query}`);
    let products = data.map(transformStrapiProduct);
    
    // Client-side sorting
    if (params?.sort === 'price-asc') {
      products.sort((a, b) => a.price - b.price);
    } else if (params?.sort === 'price-desc') {
      products.sort((a, b) => b.price - a.price);
    }
    
    return products;
  } catch (error) {
    console.error('Failed to fetch products from Strapi, using local data:', error);
    return localProducts;
  }
};

/**
 * Get single product by slug
 */
export const getProductBySlug = async (slug: string): Promise<Product | undefined> => {
  if (!USE_STRAPI) {
    return localProducts.find(p => p.slug === slug);
  }

  try {
    const data = await strapiClient.get<any[]>(
      `/products?filters[slug][$eq]=${slug}&populate=*`
    );
    return data[0] ? transformStrapiProduct(data[0]) : undefined;
  } catch (error) {
    console.error('Failed to fetch product from Strapi, using local data:', error);
    return localProducts.find(p => p.slug === slug);
  }
};

/**
 * Get featured/bestseller products
 */
export const getFeaturedProducts = async (): Promise<Product[]> => {
  if (!USE_STRAPI) {
    return localProducts.filter(p => p.isFeatured || p.isBestSeller).slice(0, 8);
  }

  try {
    const data = await strapiClient.get<any[]>(
      `/products?filters[$or][0][isFeatured][$eq]=true&filters[$or][1][isBestSeller][$eq]=true&populate=*&pagination[limit]=8`
    );
    return data.map(transformStrapiProduct);
  } catch (error) {
    console.error('Failed to fetch featured products from Strapi, using local data:', error);
    return localProducts.filter(p => p.isFeatured || p.isBestSeller).slice(0, 8);
  }
};

/**
 * Get all categories
 */
export const getCategories = async () => {
  if (!USE_STRAPI) {
    return localCategories;
  }

  try {
    const data = await strapiClient.get<any[]>('/categories?populate=*');
    return data.map((item: any) => ({
      id: item.id.toString(),
      name: item.attributes.name,
      nameEn: item.attributes.nameEn || '',
      slug: item.attributes.slug,
      description: item.attributes.description || '',
      image: item.attributes.image?.data?.attributes?.url 
        ? strapiClient.getImageUrl(item.attributes.image.data.attributes.url)
        : '',
    }));
  } catch (error) {
    console.error('Failed to fetch categories from Strapi, using local data:', error);
    return localCategories;
  }
};
