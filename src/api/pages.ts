/**
 * Pages API - CMS Pages managed via AdminJS
 * Note: Paths do NOT include /api prefix as VITE_API_URL already includes it
 */
import { apiClient, ApiResponse } from './client';

export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'draft' | 'published';
  publishedAt?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get all published pages
 */
export const getPages = async (): Promise<Page[]> => {
  try {
    // Note: NO /api prefix - VITE_API_URL already includes it
    const response = await apiClient.get<ApiResponse<Page[]>>('/pages');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch pages:', error);
    return [];
  }
};

/**
 * Get single page by slug
 */
export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  try {
    const response = await apiClient.get<ApiResponse<Page>>(`/pages/${slug}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch page ${slug}:`, error);
    return null;
  }
};
