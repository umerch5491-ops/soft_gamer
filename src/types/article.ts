export type CategorySlug = 
  | 'gaming-news'
  | 'pc-gaming'
  | 'mobile-gaming'
  | 'console-gaming'
  | 'game-guides'
  | 'reviews';

export interface CategoryInfo {
  name: string;
  slug: CategorySlug;
  description: string;
  badgeColor: string;
}

export interface Author {
  name: string;
  role: string;
  avatar?: string;
  bio?: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: CategorySlug;
  categoryName: string;
  author: Author;
  featuredImage: string;
  imageAlt: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  featured?: boolean;
  trendingRank?: number;
  readTime: string;
  seoTitle?: string;
  metaDescription?: string;
  editorialChecklist?: Record<string, boolean>;
}
