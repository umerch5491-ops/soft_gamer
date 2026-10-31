import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';

export const revalidate = 60;

const category = CATEGORIES['gaming-news'];
const canonical = getCanonicalUrl('/gaming-news');

export const metadata: Metadata = {
  title: 'Gaming News — Breaking Headlines & Industry Developments',
  description: category.description,
  alternates: {
    canonical,
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

export default function GamingNewsPage() {
  return <CategoryPageTemplate slug="gaming-news" />;
}

