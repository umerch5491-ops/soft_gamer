import Link from 'next/link';
import { TrendingUp, Clock } from 'lucide-react';
import { Article } from '@/types/article';

interface TrendingArticlesProps {
  articles: Article[];
}

export function TrendingArticles({ articles }: TrendingArticlesProps) {
  return (
    <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#272B3A]">
        <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
        <h3 className="text-xl font-bold text-[#F8FAFC]">Trending Coverage</h3>
      </div>

      <div className="divide-y divide-[#272B3A]">
        {articles.map((article, index) => {
          const rank = index + 1;
          return (
            <div key={article.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4 group">
              <span className="font-extrabold text-2xl text-[#272B3A] group-hover:text-[#8B5CF6] transition-colors shrink-0 w-8">
                {String(rank).padStart(2, '0')}
              </span>
              <div className="flex-grow">
                <span className="text-[11px] font-semibold text-[#38BDF8] uppercase tracking-wider block mb-1">
                  {article.categoryName}
                </span>
                <h4 className="text-sm font-semibold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-2 leading-snug mb-1.5">
                  <Link href={`/articles/${article.slug}`}>
                    {article.title}
                  </Link>
                </h4>
                <div className="flex items-center gap-2 text-[11px] text-[#A1A1AA]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#8B5CF6]" />
                    {article.readTime}
                  </span>
                  <span>•</span>
                  <span>By {article.author.name}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

