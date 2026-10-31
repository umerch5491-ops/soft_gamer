import { Metadata } from 'next';
import { 
  getFeaturedArticle, 
  getLatestArticles, 
  getTrendingArticles, 
  getArticlesByCategory 
} from '@/lib/articles';
import { FeaturedArticle } from '@/components/home/FeaturedArticle';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { TrendingArticles } from '@/components/home/TrendingArticles';
import { CategoryCards } from '@/components/home/CategoryCards';
import { NewsletterPlaceholder } from '@/components/home/NewsletterPlaceholder';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Soft Gamer — Premium Dark Gaming Magazine & Analysis',
  description: 'International gaming news, technical deep dives, PC performance benchmarks, console architectures, and tactical guides.',
};

export default async function HomePage() {
  const [
    featured,
    latestNews,
    trending,
    guides,
    reviews,
  ] = await Promise.all([
    getFeaturedArticle(),
    getLatestArticles(6),
    getTrendingArticles(5),
    getArticlesByCategory('game-guides', 3),
    getArticlesByCategory('reviews', 3),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Section A: Featured Story Hero */}
      {featured && <FeaturedArticle article={featured} />}

      {/* Section B & C: Latest Gaming News (Grid) + Trending Articles (Sidebar) */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main 6 Article Grid */}
          <div className="lg:col-span-8">
            <SectionHeading
              title="Latest Gaming Coverage"
              subtitle="Analytical reporting, hardware updates, and editorial commentary"
              badge="News & Analysis"
              viewAllHref="/gaming-news"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {latestNews.map((article, idx) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  priority={idx < 2}
                />
              ))}
            </div>
          </div>

          {/* Section C: Trending Coverage Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <TrendingArticles articles={trending} />
          </div>
        </div>
      </section>

      {/* Section D: Gaming Categories Showcase */}
      <section>
        <SectionHeading
          title="Browse Editorial Hubs"
          subtitle="Explore specialized verticals covering systems, platforms, and tactical play"
          badge="Categories"
        />
        <CategoryCards />
      </section>

      {/* Section E: Latest Game Guides */}
      <section>
        <SectionHeading
          title="Tactical Guides & Walkthroughs"
          subtitle="In-depth progression strategies, optimization paths, and mechanical mastery"
          badge="Guides"
          viewAllHref="/game-guides"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {guides.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Section F: Reviews */}
      <section>
        <SectionHeading
          title="Editorial Critiques & Reviews"
          subtitle="Unbiased gameplay analysis, performance metrics, and level design evaluations"
          badge="Reviews"
          viewAllHref="/reviews"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>

      {/* Section G: Newsletter Placeholder */}
      <section>
        <NewsletterPlaceholder />
      </section>
    </div>
  );
}
