import { MetadataRoute } from 'next';
import { getAllArticles, getAllAuthors, getArticlesByCategory } from '@/lib/articles';
import { SITE_URL } from '@/lib/site';
import { CategorySlug } from '@/types/article';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL;
  const allArticles = await getAllArticles();

  // Strictly filter to only published, non-scheduled articles for public indexation
  const now = Date.now();
  const publishedArticles = allArticles.filter(
    (article) =>
      article.status === 'published' &&
      new Date(article.publishedAt).getTime() <= now
  );

  // Latest editorial timestamp for homepage & category freshness
  const latestArticleDate = publishedArticles.length > 0
    ? new Date(publishedArticles[0].updatedAt || publishedArticles[0].publishedAt)
    : new Date();

  // Stable revision date for legal and company static pages (updated Nov 2026)
  const legalPagesDate = new Date('2026-11-03T00:00:00.000Z');

  // Core static pages (Always indexed and essential for AdSense trust)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestArticleDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: legalPagesDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: legalPagesDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: legalPagesDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: legalPagesDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: legalPagesDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Only include category hubs in sitemap if they have at least 1 published article
  // (Prevents GSC 'Submitted URL marked noindex' errors for empty categories)
  const categorySlugs: CategorySlug[] = [
    'gaming-news',
    'pc-gaming',
    'mobile-gaming',
    'console-gaming',
    'game-guides',
    'reviews',
  ];

  const categoryRoutes: MetadataRoute.Sitemap = [];
  for (const slug of categorySlugs) {
    const catArticles = await getArticlesByCategory(slug, 1);
    if (catArticles.length > 0) {
      categoryRoutes.push({
        url: `${baseUrl}/${slug}`,
        lastModified: latestArticleDate,
        changeFrequency: 'daily',
        priority: 0.85,
      });
    }
  }

  // Article individual dynamic routes
  const articleRoutes: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'monthly',
    priority: article.featured ? 0.9 : 0.75,
  }));

  // Author profile routes
  const authors = await getAllAuthors();
  const authorRoutes: MetadataRoute.Sitemap = authors.map((auth) => ({
    url: `${baseUrl}/author/${auth.slug || 'umer-jamil'}`,
    lastModified: latestArticleDate,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...articleRoutes, ...authorRoutes];
}
