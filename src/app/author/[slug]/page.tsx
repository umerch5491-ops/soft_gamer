import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { User, BookOpen } from 'lucide-react';
import { getAuthorBySlug, getArticlesByAuthor, getAllAuthors } from '@/lib/articles';
import { ArticleCard } from '@/components/articles/ArticleCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getCanonicalUrl } from '@/lib/constants';

interface AuthorPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const authors = await getAllAuthors();
  return authors.map((author) => ({
    slug: author.slug || 'umer-jamil',
  }));
}

export async function generateMetadata({ params }: AuthorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return {
      title: 'Author Not Found | Soft Gamer',
      robots: { index: false, follow: false },
    };
  }

  const canonical = getCanonicalUrl(`/author/${author.slug || slug}`);

  return {
    title: `${author.name} — Author Profile | Soft Gamer`,
    description: author.bio || `Read articles, reviews, and guides by ${author.name} on Soft Gamer.`,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${author.name} — Soft Gamer`,
      description: author.bio || `Articles by ${author.name} on Soft Gamer.`,
      url: canonical,
      type: 'profile',
    },
  };
}

export default async function AuthorPage({ params }: AuthorPageProps) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  const articles = await getArticlesByAuthor(author.slug || slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs
        items={[
          { label: 'Authors' },
          { label: author.name },
        ]}
      />

      {/* Author Profile Header */}
      <header className="rounded-2xl bg-[#111522] border border-[#272B3A] p-6 sm:p-10 mb-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-[#171C2B] border border-[#8B5CF6]/40 flex items-center justify-center text-[#8B5CF6] shrink-0 shadow-lg shadow-[#8B5CF6]/10">
            <User className="w-10 h-10" />
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
                {author.name}
              </h1>
              <span className="px-3 py-1 rounded-md bg-[#171C2B] text-[#38BDF8] border border-[#272B3A] text-xs font-semibold">
                {author.role}
              </span>
            </div>

            <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed max-w-2xl">
              {author.bio}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#A1A1AA] pt-1">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span>{articles.length} Published {articles.length === 1 ? 'Article' : 'Articles'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Author's Articles Grid */}
      <section>
        <h2 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] mb-6">
          Articles by {author.name}
        </h2>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art, idx) => (
              <ArticleCard key={art.id} article={art} priority={idx < 3} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center bg-[#111522] border border-[#272B3A] rounded-2xl text-[#A1A1AA]">
            <p className="text-lg font-semibold text-[#F8FAFC] mb-2">No Articles Yet</p>
            <p className="text-sm">Articles by {author.name} will appear here once published.</p>
          </div>
        )}
      </section>
    </div>
  );
}

