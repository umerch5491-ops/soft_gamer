import { Metadata } from 'next';
import { searchArticles } from '@/lib/articles';
import { SearchInterface } from '@/components/search/SearchInterface';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Search Articles — Soft Gamer Editorial Database',
  description: 'Search gaming news, guides, reviews, and hardware breakdowns across the Soft Gamer archive.',
  alternates: {
    canonical: '/search',
  },
  robots: {
    index: false,
    follow: true,
  },
};

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q || '';
  const results = query ? await searchArticles(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Search' }]} />

      <header className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mb-2">
          Search Soft Gamer
        </h1>
        <p className="text-[#A1A1AA] text-sm">
          Explore our repository of system breakdowns, game guides, and editorial critiques.
        </p>
      </header>

      <SearchInterface initialQuery={query} initialResults={results} />
    </div>
  );
}
