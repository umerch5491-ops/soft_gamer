import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';

export const revalidate = 60;

const category = CATEGORIES['console-gaming'];
const canonical = getCanonicalUrl('/console-gaming');

export const metadata: Metadata = {
  title: 'Console Gaming — Architecture, Ecosystems & Titles',
  description: category.description,
  alternates: {
    canonical,
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

export default function ConsoleGamingPage() {
  return <CategoryPageTemplate slug="console-gaming" />;
}

