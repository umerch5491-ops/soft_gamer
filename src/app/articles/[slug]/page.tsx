import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ArticleContent } from '@/components/articles/ArticleContent';
import { RelatedArticles } from '@/components/articles/RelatedArticles';
import { formatDate, getCanonicalUrl, getAbsoluteImageUrl } from '@/lib/constants';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/structuredData';
import { AdSlot } from '@/components/ads/AdSlot';

interface ArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'The requested editorial piece could not be located.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const articleUrl = getCanonicalUrl(`/articles/${article.slug}`);
  const pageTitle = article.seoTitle || article.title;
  const pageDescription = article.metaDescription || article.excerpt;
  const featuredImageUrl = getAbsoluteImageUrl(article.featuredImage);

  // Indexing rules: Drafts or scheduled articles must never be indexed
  const isIndexable =
    article.status === 'published' &&
    new Date(article.publishedAt).getTime() <= Date.now();

  return {
    title: pageTitle,
    description: pageDescription,
    authors: [{ name: article.author.name }],
    robots: {
      index: isIndexable,
      follow: isIndexable,
      googleBot: {
        index: isIndexable,
        follow: isIndexable,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'article',
      url: articleUrl,
      title: pageTitle,
      description: pageDescription,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [article.author.name],
      tags: article.tags,
      images: [
        {
          url: featuredImageUrl,
          alt: article.imageAlt,
          width: 1200,
          height: 675,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
      images: [featuredImageUrl],
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const related = await getRelatedArticles(article.slug, article.category, 3);

  // Article & Breadcrumb JSON-LD Structured Data
  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: article.categoryName, href: `/${article.category}` },
    { label: article.title },
  ]);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Schema.org Article Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {/* Schema.org BreadcrumbList Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: article.categoryName, href: `/${article.category}` },
          { label: article.title },
        ]}
      />

      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-3 text-xs sm:text-sm text-[#A1A1AA] mb-4">
          <span className="px-3 py-1 rounded-md bg-[#171C2B] text-[#38BDF8] border border-[#272B3A] font-semibold">
            {article.categoryName}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#8B5CF6]" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight mb-6">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-[#A1A1AA] leading-relaxed mb-6 font-normal">
          {article.excerpt}
        </p>

        {/* Author & Timestamp Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#272B3A]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#171C2B] border border-[#272B3A] flex items-center justify-center text-[#8B5CF6]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F8FAFC]">{article.author.name}</p>
              <p className="text-xs text-[#A1A1AA]">{article.author.role}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#A1A1AA]">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#38BDF8]" />
              Published: {formatDate(article.publishedAt)}
            </span>
            {article.updatedAt && (
              <span className="hidden sm:inline-block">
                (Updated: {formatDate(article.updatedAt)})
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Hero Featured Media */}
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#111522] border border-[#272B3A] mb-8 shadow-xl">
        <Image
          src={article.featuredImage}
          alt={article.imageAlt}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      {/* Google AdSense Placement — Top Content (Zero layout shift when disabled) */}
      <AdSlot position="article-top" />

      {/* Main Formatted Article Content */}
      <main className="mb-10">
        <ArticleContent content={article.content} />
      </main>

      {/* Google AdSense Placement — Bottom Content */}
      <AdSlot position="article-bottom" />

      {/* Tags Section */}
      {article.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-6 pb-8 border-t border-[#272B3A]">
          <span className="inline-flex items-center gap-1 text-xs text-[#A1A1AA] mr-2">
            <Tag className="w-3.5 h-3.5 text-[#8B5CF6]" />
            Tags:
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2.5 py-1 rounded bg-[#171C2B] text-[#A1A1AA] border border-[#272B3A]"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related Articles Component */}
      <RelatedArticles articles={related} />
    </article>
  );
}

