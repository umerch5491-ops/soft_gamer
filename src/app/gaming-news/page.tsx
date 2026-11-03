import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const category = CATEGORIES['gaming-news'];
const canonical = getCanonicalUrl('/gaming-news');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('gaming-news');
  return {
    metadataBase: new URL('https://www.softgamer.online'),
    title: 'Gaming News — Breaking Headlines & Industry Developments',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length >= 3,
      follow: true,
    },
    openGraph: {
      title: 'Gaming News — Breaking Headlines & Industry Developments',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Gaming News — Breaking Headlines & Industry Developments',
      description: category.description,
    },
  };
}

export default function GamingNewsPage() {
  return <CategoryPageTemplate slug="gaming-news" />;
}
