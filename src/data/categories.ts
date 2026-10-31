import { CategoryInfo, CategorySlug } from '@/types/article';

export const CATEGORIES: Record<CategorySlug, CategoryInfo> = {
  'gaming-news': {
    name: 'Gaming News',
    slug: 'gaming-news',
    description: 'Fresh updates, industry shifts, studio announcements, and major headlines across gaming.',
    badgeColor: '#8B5CF6',
  },
  'pc-gaming': {
    name: 'PC Gaming',
    slug: 'pc-gaming',
    description: 'Hardware insights, Steam highlights, system benchmarks, and tactical PC experiences.',
    badgeColor: '#38BDF8',
  },
  'mobile-gaming': {
    name: 'Mobile Gaming',
    slug: 'mobile-gaming',
    description: 'Handheld updates, cross-platform gems, touch controllers, and iOS/Android analysis.',
    badgeColor: '#10B981',
  },
  'console-gaming': {
    name: 'Console Gaming',
    slug: 'console-gaming',
    description: 'PlayStation 5, Xbox Series X|S, and Nintendo ecosystem breakthroughs and exclusives.',
    badgeColor: '#F59E0B',
  },
  'game-guides': {
    name: 'Game Guides',
    slug: 'game-guides',
    description: 'Comprehensive walkthroughs, build recommendations, mechanics breakdowns, and progression tips.',
    badgeColor: '#EC4899',
  },
  'reviews': {
    name: 'Reviews',
    slug: 'reviews',
    description: 'Editorial impressions, performance breakdowns, and gameplay critiques without fabricated scores.',
    badgeColor: '#6366F1',
  },
};

