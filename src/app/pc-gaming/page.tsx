import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';

export const revalidate = 60;

const category = CATEGORIES['pc-gaming'];
const canonical = getCanonicalUrl('/pc-gaming');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('pc-gaming');
  return {
    title: 'PC Gaming — Hardware, Benchmarks & Optimizations',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length >= 3,
      follow: true,
    },
    openGraph: {
      title: 'PC Gaming — Hardware, Benchmarks & Optimizations',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PC Gaming — Hardware, Benchmarks & Optimizations',
      description: category.description,
    },
  };
}

export default function PCGamingPage() {
  return <CategoryPageTemplate slug="pc-gaming" />;
}
