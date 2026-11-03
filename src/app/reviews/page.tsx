import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const category = CATEGORIES['reviews'];
const canonical = getCanonicalUrl('/reviews');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('reviews');
  return {
    metadataBase: new URL(SITE_URL),
    title: 'Reviews — Unbiased Gaming & Hardware Critiques',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length > 0,
      follow: true,
    },
    openGraph: {
      title: 'Reviews — Unbiased Gaming & Hardware Critiques',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Reviews — Unbiased Gaming & Hardware Critiques',
      description: category.description,
    },
  };
}

export default function ReviewsPage() {
  return <CategoryPageTemplate slug="reviews" />;
}
