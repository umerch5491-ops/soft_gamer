import { CategorySlug } from '@/types/article';

export type UserRole = 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface DashboardMetrics {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  totalCategories: number;
  totalMediaItems: number;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  altText: string;
  sizeBytes: number;
  mimeType: string;
  width?: number;
  height?: number;
  uploadedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  badgeColor: string;
  articleCount: number;
}

export interface AdminSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  editorialDeskEmail: string;
  defaultSeoTitle: string;
  defaultMetaDescription: string;
  twitterHandle: string;
  publisherName: string;
  publisherAddress: string;
  googleSiteVerification?: string;
  adsensePublisherId?: string;
  adsEnabled: boolean;
  isDemoMode: boolean;
}

export interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  category: CategorySlug;
  authorName: string;
  authorRole: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  featured: boolean;
  scheduledAt?: string;
  seoTitle?: string;
  metaDescription?: string;
  editorialChecklist?: Record<string, boolean>;
}
