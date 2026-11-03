import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const category = CATEGORIES['pc-gaming'];
const canonical = getCanonicalUrl('/pc-gaming');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('pc-gaming');
  return {
    metadataBase: new URL(SITE_URL),
    title: 'PC Gaming — Hardware Benchmarks & Performance Guides',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length > 0,
      follow: true,
    },
    openGraph: {
      title: 'PC Gaming — Hardware Benchmarks & Performance Guides',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PC Gaming — Hardware Benchmarks & Performance Guides',
      description: category.description,
    },
  };
}

export default function PcGamingPage() {
  return <CategoryPageTemplate slug="pc-gaming" />;
}
