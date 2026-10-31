import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';

export const revalidate = 60;

const category = CATEGORIES['pc-gaming'];
const canonical = getCanonicalUrl('/pc-gaming');

export const metadata: Metadata = {
  title: 'PC Gaming — Hardware, Benchmarks & Optimizations',
  description: category.description,
  alternates: {
    canonical,
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

export default function PCGamingPage() {
  return <CategoryPageTemplate slug="pc-gaming" />;
}

