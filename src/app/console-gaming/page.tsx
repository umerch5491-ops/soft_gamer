import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const category = CATEGORIES['console-gaming'];
const canonical = getCanonicalUrl('/console-gaming');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('console-gaming');
  return {
    metadataBase: new URL(SITE_URL),
    title: 'Console Gaming — PlayStation, Xbox & Switch Coverage',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length > 0,
      follow: true,
    },
    openGraph: {
      title: 'Console Gaming — PlayStation, Xbox & Switch Coverage',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Console Gaming — PlayStation, Xbox & Switch Coverage',
      description: category.description,
    },
  };
}

export default function ConsoleGamingPage() {
  return <CategoryPageTemplate slug="console-gaming" />;
}
