import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';

export const revalidate = 60;

const category = CATEGORIES['reviews'];
const canonical = getCanonicalUrl('/reviews');

export const metadata: Metadata = {
  title: 'Editorial Reviews — Gameplay & Technical Critiques',
  description: category.description,
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Editorial Reviews — Gameplay & Technical Critiques',
    description: category.description,
    url: canonical,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editorial Reviews — Gameplay & Technical Critiques',
    description: category.description,
  },
};

export default function ReviewsPage() {
  return <CategoryPageTemplate slug="reviews" />;
}

