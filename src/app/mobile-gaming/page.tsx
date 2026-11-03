import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';
import { getArticlesByCategory } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const category = CATEGORIES['mobile-gaming'];
const canonical = getCanonicalUrl('/mobile-gaming');

export async function generateMetadata(): Promise<Metadata> {
  const articles = await getArticlesByCategory('mobile-gaming');
  return {
    metadataBase: new URL(SITE_URL),
    title: 'Mobile Gaming — Updates, Guides & Handheld Coverage',
    description: category.description,
    alternates: {
      canonical,
    },
    robots: {
      index: articles.length > 0,
      follow: true,
    },
    openGraph: {
      title: 'Mobile Gaming — Updates, Guides & Handheld Coverage',
      description: category.description,
      url: canonical,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Mobile Gaming — Updates, Guides & Handheld Coverage',
      description: category.description,
    },
  };
}

export default function MobileGamingPage() {
  return <CategoryPageTemplate slug="mobile-gaming" />;
}
