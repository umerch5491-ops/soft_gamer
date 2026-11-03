import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';

export const revalidate = 60;

const category = CATEGORIES['console-gaming'];
const canonical = getCanonicalUrl('/console-gaming');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('console-gaming');
  return {
    title: 'Console Gaming — Architecture, Ecosystems & Titles',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length >= 3,
      follow: true,
    },
    openGraph: {
      title: 'Console Gaming — Architecture, Ecosystems & Titles',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Console Gaming — Architecture, Ecosystems & Titles',
      description: category.description,
    },
  };
}

export default function ConsoleGamingPage() {
  return <CategoryPageTemplate slug="console-gaming" />;
}
