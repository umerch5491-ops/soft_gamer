import { ArticleCard } from '@/components/articles/ArticleCard';
import { Article } from '@/types/article';

interface RelatedArticlesProps {
  articles: Article[];
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-[#272B3A]">
      <h3 className="text-xl md:text-2xl font-extrabold text-[#F8FAFC] mb-6">
        Related Coverage &amp; Analysis
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((art) => (
          <ArticleCard key={art.id} article={art} />
        ))}
      </div>
    </section>
  );
}

