/**
 * Settings API - Fetch site settings from backend
 * Homepage settings, hero content, etc.
 */
import { apiClient, ApiResponse } from './client';
import { getPageBySlug, Page } from './pages';

export interface HeroSettings {
  badge: string;
  title: string;
  titleHighlight: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface StatsItem {
  value: string;
  label: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export interface HomeSettings {
  hero: HeroSettings;
  stats: StatsItem[];
  showNewArrivals: boolean;
  showBestsellers: boolean;
  showFeatured: boolean;
  showBlog: boolean;
}

// Default settings when no CMS content available
const defaultHeroSettings: HeroSettings = {
  badge: 'کلکسیون زمستان 1404',
  title: 'استایل استریت',
  titleHighlight: 'برای نسل جدید',
  subtitle: 'هودی، شلوار و اکسسوری‌های اورجینال با کیفیت پرمیوم',
  ctaPrimary: 'خرید محصولات',
  ctaSecondary: 'درباره TM-BRAND',
};

const defaultStats: StatsItem[] = [
  { value: '+۵۰۰۰', label: 'مشتری راضی' },
  { value: '+۲۰۰', label: 'محصول متنوع' },
  { value: '۹۸٪', label: 'رضایت مشتری' },
  { value: '۱۰۰٪', label: 'محصول اورجینال' },
];

const defaultHomeSettings: HomeSettings = {
  hero: defaultHeroSettings,
  stats: defaultStats,
  showNewArrivals: true,
  showBestsellers: true,
  showFeatured: true,
  showBlog: true,
};

/**
 * Get homepage settings from CMS
 * Uses a special "home" page or "home-settings" page in CMS
 */
export const getHomeSettings = async (): Promise<HomeSettings> => {
  try {
    // Try to fetch home settings page
    const homePage = await getPageBySlug('home-settings');
    
    if (homePage && homePage.content) {
      try {
        // Parse JSON content from CMS
        const parsed = JSON.parse(homePage.content);
        return {
          hero: { ...defaultHeroSettings, ...parsed.hero },
          stats: parsed.stats || defaultStats,
          showNewArrivals: parsed.showNewArrivals ?? true,
          showBestsellers: parsed.showBestsellers ?? true,
          showFeatured: parsed.showFeatured ?? true,
          showBlog: parsed.showBlog ?? true,
        };
      } catch {
        // If content is not JSON, use defaults
        return defaultHomeSettings;
      }
    }
    
    return defaultHomeSettings;
  } catch (error) {
    console.error('Failed to fetch home settings:', error);
    return defaultHomeSettings;
  }
};

/**
 * Get about page content
 */
export const getAboutContent = async () => {
  const page = await getPageBySlug('about-us');
  return page;
};

/**
 * Get contact page content
 */
export const getContactContent = async () => {
  const page = await getPageBySlug('contact-us');
  return page;
};
