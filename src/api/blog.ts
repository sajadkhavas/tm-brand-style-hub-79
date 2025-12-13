/**
 * Blog API - Fetches from Node.js backend managed via AdminJS
 */
import { BlogPost } from '@/types';
import { apiClient, ApiResponse } from './client';

interface BackendBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  tag?: string;
  readTime?: string;
  isPublished: boolean;
  publishedAt?: string;
  authorId?: string;
  author?: {
    id: string;
    fullName: string;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Transform backend blog post to frontend BlogPost type
 */
const transformBlogPost = (item: BackendBlogPost): BlogPost => {
  // Handle content - can be HTML string, parse paragraphs
  let content: string[] = [];
  if (item.content) {
    // If it's HTML, we'll keep it as single item for rendering
    if (item.content.includes('<')) {
      content = [item.content];
    } else {
      // Plain text - split by paragraphs
      content = item.content.split('\n\n').filter(Boolean);
    }
  }

  // Format date in Farsi
  const formatPersianDate = (dateStr?: string): string => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('fa-IR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(date);
    } catch {
      return dateStr;
    }
  };

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt || '',
    content,
    tags: item.tag ? [item.tag] : [],
    publishedAt: formatPersianDate(item.publishedAt),
    readTimeMinutes: parseInt(item.readTime || '3', 10),
  };
};

/**
 * Get all published blog posts
 */
export const getBlogPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendBlogPost[]>>('/api/blog');
    return (response.data || []).map(transformBlogPost);
  } catch (error) {
    console.error('Failed to fetch blog posts:', error);
    return [];
  }
};

/**
 * Get single blog post by slug
 */
export const getBlogPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    const response = await apiClient.get<ApiResponse<BackendBlogPost>>(`/api/blog/${slug}`);
    return response.data ? transformBlogPost(response.data) : undefined;
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug}:`, error);
    return undefined;
  }
};
