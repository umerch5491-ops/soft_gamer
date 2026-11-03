import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';

export const revalidate = 60;

const category = CATEGORIES['game-guides'];
const canonical = getCanonicalUrl('/game-guides');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('game-guides');
  return {
    title: 'Game Guides — Tactical Walkthroughs & Mechanics',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length >= 3,
      follow: true,
    },
    openGraph: {
      title: 'Game Guides — Tactical Walkthroughs & Mechanics',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Game Guides — Tactical Walkthroughs & Mechanics',
      description: category.description,
    },
  };
}

export default function GameGuidesPage() {
  return <CategoryPageTemplate slug="game-guides" />;
}
