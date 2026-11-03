import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';

export const revalidate = 60;

const category = CATEGORIES['reviews'];
const canonical = getCanonicalUrl('/reviews');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('reviews');
  return {
    title: 'Editorial Reviews — Gameplay & Technical Critiques',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length >= 3,
      follow: true,
    },
    openGraph: {
      title: 'Editorial Reviews — Gameplay & Technical Critiques',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Editorial Reviews — Gameplay & Technical Critiques',
      description: category.description,
    },
  };
}

export default function ReviewsPage() {
  return <CategoryPageTemplate slug="reviews" />;
}
