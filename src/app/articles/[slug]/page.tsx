import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, Tag, User, ChevronLeft, ChevronRight, MessageSquare, ExternalLink } from 'lucide-react';
import { getArticleBySlug, getRelatedArticles, getAdjacentArticles } from '@/lib/articles';
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

// Force dynamic SSR rendering on every request to ensure fresh data from Supabase
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getCleanDescription(article: { metaDescription?: string; excerpt?: string; content?: string }): string {
  if (article.metaDescription && article.metaDescription.trim().length >= 50) {
    return article.metaDescription.trim();
  }
  if (article.excerpt && article.excerpt.trim().length >= 50 && !article.excerpt.endsWith('…')) {
    return article.excerpt.trim();
  }
  // Strip HTML / Markdown and take first 155 chars cleanly up to the last whole word
  const plain = (article.content || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*`_~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length <= 155) return plain;
  const truncated = plain.slice(0, 155);
  const lastSpace = truncated.lastIndexOf(' ');
  const clean = lastSpace > 80 ? truncated.slice(0, lastSpace) : truncated;
  return clean.replace(/[,;:]$/, '') + '.';
}

function getDescriptiveImageAlt(article: { title: string; imageAlt?: string }): string {
  if (article.imageAlt && article.imageAlt.trim().length > 5 && !/^\d+[\s_-]\d+/.test(article.imageAlt)) {
    return article.imageAlt.trim();
  }
  return `${article.title} — Soft Gamer featured gameplay and news`;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      metadataBase: new URL('https://www.softgamer.online'),
      title: 'Article Not Found | Soft Gamer',
      description: 'The requested editorial piece could not be located.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const articleUrl = getCanonicalUrl(`/articles/${article.slug}`);
  const pageTitle = article.seoTitle || `${article.title} | Soft Gamer`;
  const pageDescription = getCleanDescription(article);
  const featuredImageUrl = getAbsoluteImageUrl(article.featuredImage);
  const imageAlt = getDescriptiveImageAlt(article);

  const isIndexable =
    article.status === 'published' &&
    new Date(article.publishedAt).getTime() <= Date.now();

  return {
    metadataBase: new URL('https://www.softgamer.online'),
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
          alt: imageAlt,
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

  const [related, adjacent] = await Promise.all([
    getRelatedArticles(article.slug, article.category, 3),
    getAdjacentArticles(article.slug),
  ]);

  const articleSchema = generateArticleSchema(article);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { label: article.categoryName, href: `/${article.category}` },
    { label: article.title },
  ]);

  const imageAlt = getDescriptiveImageAlt(article);
  const authorSlug = article.author.slug || 'soft-gamer-staff';

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
          <Link
            href={`/${article.category}`}
            className="px-3 py-1 rounded-md bg-[#171C2B] text-[#38BDF8] border border-[#272B3A] font-semibold hover:border-[#38BDF8] transition-colors"
          >
            {article.categoryName}
          </Link>
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

        {/* Author Byline & Timestamp Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-[#272B3A]">
          <Link
            href={`/author/${authorSlug}`}
            className="group flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-[#171C2B] border border-[#272B3A] group-hover:border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6] transition-colors shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                {article.author.name}
              </p>
              <p className="text-xs text-[#A1A1AA]">{article.author.role}</p>
            </div>
          </Link>

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
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="object-cover"
        />
      </div>

      {/* Google AdSense Placement — Top Content (Zero layout shift when disabled) */}
      <AdSlot position="article-top" />

      {/* Main Formatted Article Content (Includes automatic Table of Contents for 3+ headings) */}
      <main className="mb-10">
        <ArticleContent content={article.content} />
      </main>

      {/* Sources & References (Optional Editorial Section) */}
      {article.sources && article.sources.length > 0 && (
        <section className="my-8 p-5 rounded-xl bg-[#111522] border border-[#272B3A]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-3 flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Sources &amp; References</span>
          </h3>
          <ul className="space-y-1.5 text-xs sm:text-sm">
            {article.sources.map((src, idx) => (
              <li key={idx}>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="text-[#38BDF8] hover:underline break-all"
                >
                  {src}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Reader Feedback Section (replaces dead comments CTA) */}
      <div className="my-8 p-5 rounded-xl bg-[#111522] border border-[#272B3A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-[#F8FAFC] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
            <span>Have feedback or a news tip on this story?</span>
          </p>
          <p className="text-xs text-[#A1A1AA] mt-1">
            Our editorial desk values reader corrections, context, and gaming insights.
          </p>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 rounded-lg bg-[#171C2B] border border-[#272B3A] text-xs font-semibold text-[#38BDF8] hover:border-[#38BDF8] transition-colors shrink-0"
        >
          Send Feedback
        </Link>
      </div>

      {/* Google AdSense Placement — Bottom Content */}
      <AdSlot position="article-bottom" />

      {/* Author Bio Box with Profile Link */}
      <div className="my-8 p-6 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-start gap-4">
        <Link
          href={`/author/${authorSlug}`}
          className="w-12 h-12 rounded-full bg-[#171C2B] border border-[#272B3A] hover:border-[#8B5CF6] flex items-center justify-center text-[#8B5CF6] shrink-0 transition-colors"
        >
          <User className="w-6 h-6" />
        </Link>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-[#A1A1AA] mb-1">Written by</p>
          <Link
            href={`/author/${authorSlug}`}
            className="font-bold text-[#F8FAFC] hover:text-[#38BDF8] transition-colors inline-block"
          >
            {article.author.name}
          </Link>
          <p className="text-xs text-[#8B5CF6] font-semibold">{article.author.role}</p>
          <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">
            {article.author.bio || 'Independent gaming journalist and editorial contributor at Soft Gamer.'}
          </p>
        </div>
      </div>

      {/* Previous / Next Article Navigation */}
      {(adjacent.prev || adjacent.next) && (
        <nav className="my-8 grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Adjacent Articles">
          {adjacent.prev ? (
            <Link
              href={`/articles/${adjacent.prev.slug}`}
              className="p-4 rounded-xl bg-[#111522] border border-[#272B3A] hover:border-[#8B5CF6] transition-all group flex flex-col justify-between"
            >
              <span className="text-xs font-semibold text-[#A1A1AA] flex items-center gap-1 group-hover:text-[#8B5CF6] transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous Article
              </span>
              <span className="text-sm font-bold text-[#F8FAFC] mt-2 line-clamp-2">
                {adjacent.prev.title}
              </span>
            </Link>
          ) : (
            <div />
          )}

          {adjacent.next && (
            <Link
              href={`/articles/${adjacent.next.slug}`}
              className="p-4 rounded-xl bg-[#111522] border border-[#272B3A] hover:border-[#38BDF8] transition-all group flex flex-col justify-between sm:text-right"
            >
              <span className="text-xs font-semibold text-[#A1A1AA] flex items-center justify-end gap-1 group-hover:text-[#38BDF8] transition-colors">
                Next Article <ChevronRight className="w-4 h-4" />
              </span>
              <span className="text-sm font-bold text-[#F8FAFC] mt-2 line-clamp-2">
                {adjacent.next.title}
              </span>
            </Link>
          )}
        </nav>
      )}

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
