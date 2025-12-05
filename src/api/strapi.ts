/**
 * Strapi CMS Client for TM-BRAND
 * Domain: tm-brand.com
 */

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const strapiClient = {
  /**
   * GET request to Strapi API
   */
  async get<T>(endpoint: string): Promise<T> {
    const url = `${STRAPI_URL}/api${endpoint}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`);
      }

      const json: StrapiResponse<T> = await response.json();
      return json.data;
    } catch (error) {
      console.error('Strapi API Error:', error);
      throw error;
    }
  },

  /**
   * Get full image URL from Strapi
   */
  getImageUrl(path: string | null | undefined): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${STRAPI_URL}${path}`;
  },

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return STRAPI_URL;
  },
};

export { STRAPI_URL };
