import { CategorySlug } from '@/types/article';
import { CATEGORIES } from '@/data/categories';
import { getArticlesByCategory } from '@/lib/articles';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { generateBreadcrumbSchema } from '@/lib/seo/structuredData';
import { AdSlot } from '@/components/ads/AdSlot';

interface CategoryPageTemplateProps {
  slug: CategorySlug;
}

export async function CategoryPageTemplate({ slug }: CategoryPageTemplateProps) {
  const categoryInfo = CATEGORIES[slug];
  const articles = await getArticlesByCategory(slug);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: categoryInfo.name, href: `/${slug}` },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Schema.org BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <Breadcrumbs items={[{ label: categoryInfo.name }]} />

      {/* Category Hero Banner */}
      <header className="relative rounded-2xl bg-[#111522] border border-[#272B3A] p-6 sm:p-10 mb-10 overflow-hidden">
        <div 
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ backgroundColor: categoryInfo.badgeColor }}
        />

        <div className="relative z-10 max-w-3xl">
          <span 
            className="inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md mb-3"
            style={{ backgroundColor: `${categoryInfo.badgeColor}20`, color: categoryInfo.badgeColor }}
          >
            Editorial Vertical
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-3">
            {categoryInfo.name}
          </h1>
          <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
            {categoryInfo.description}
          </p>
        </div>
      </header>

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((art, idx) => (
              <ArticleCard key={art.id} article={art} priority={idx === 0} />
            ))}
          </div>

          {/* Non-intrusive Ad break between cards (only renders when ads are enabled) */}
          {articles.length > 3 && <AdSlot position="feed-between" />}

          {articles.length > 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.slice(3).map((art) => (
                <ArticleCard key={art.id} article={art} />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-12 text-center bg-[#111522] border border-[#272B3A] rounded-2xl text-[#A1A1AA]">
          <p className="text-lg font-semibold text-[#F8FAFC] mb-2">No Articles In This Category Yet</p>
          <p className="text-sm">Editorial coverage for this hub is scheduled for publication soon.</p>
        </div>
      )}
    </div>
  );
}

