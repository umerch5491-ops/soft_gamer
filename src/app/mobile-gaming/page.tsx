import { Metadata } from 'next';
import { CategoryPageTemplate } from '@/components/articles/CategoryPageTemplate';
import { CATEGORIES } from '@/data/categories';
import { getCanonicalUrl } from '@/lib/constants';

export const revalidate = 60;

const category = CATEGORIES['mobile-gaming'];
const canonical = getCanonicalUrl('/mobile-gaming');

export const metadata: Metadata = {
  title: 'Mobile Gaming — Handhelds, Silicon & Cross-Platform Play',
  description: category.description,
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Mobile Gaming — Handhelds, Silicon & Cross-Platform Play',
    description: category.description,
    url: canonical,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobile Gaming — Handhelds, Silicon & Cross-Platform Play',
    description: category.description,
  },
};

export default function MobileGamingPage() {
  return <CategoryPageTemplate slug="mobile-gaming" />;
}

