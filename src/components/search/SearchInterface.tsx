'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { Article } from '@/types/article';
import { ArticleCard } from '@/components/articles/ArticleCard';

interface SearchInterfaceProps {
  initialQuery?: string;
  initialResults?: Article[];
}

export function SearchInterface({ initialQuery = '', initialResults = [] }: SearchInterfaceProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push('/search');
    } else {
      startTransition(() => {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Search Input Bar */}
      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles by title, mechanics, topic, tags or author..."
            className="w-full pl-12 pr-28 py-3.5 rounded-xl bg-[#111522] border border-[#272B3A] text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6] transition-colors text-sm sm:text-base"
          />
          <Search className="w-5 h-5 text-[#A1A1AA] absolute left-4 pointer-events-none" />

          <button
            type="submit"
            disabled={isPending}
            className="absolute right-2 px-4 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs sm:text-sm font-semibold hover:bg-[#7c3aed] transition-colors disabled:opacity-60 flex items-center gap-1.5"
          >
            {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Search</span>
          </button>
        </div>
      </form>

      {/* Results Display */}
      {initialQuery ? (
        <div>
          <div className="mb-6 flex items-center justify-between text-sm text-[#A1A1AA] pb-3 border-b border-[#272B3A]">
            <p>
              Showing results for: <span className="font-semibold text-[#F8FAFC]">&ldquo;{initialQuery}&rdquo;</span>
            </p>
            <p>{initialResults.length} {initialResults.length === 1 ? 'article' : 'articles'} found</p>
          </div>

          {initialResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialResults.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#111522] border border-[#272B3A] rounded-2xl max-w-xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-[#171C2B] text-[#8B5CF6] flex items-center justify-center mx-auto mb-4 border border-[#272B3A]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">No Matching Articles Found</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed mb-4">
                We couldn&apos;t find any articles matching your search query. Try searching for broader terms like &ldquo;GPU&rdquo;, &ldquo;Latency&rdquo;, &ldquo;Consoles&rdquo;, or &ldquo;Survival&rdquo;.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-[#111522]/50 border border-[#272B3A] rounded-2xl max-w-xl mx-auto">
          <p className="text-sm text-[#A1A1AA]">
            Enter search keywords above to query our local editorial database in real-time.
          </p>
        </div>
      )}
    </div>
  );
}
