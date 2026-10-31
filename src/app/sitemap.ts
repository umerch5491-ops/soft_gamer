import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { SITE_CONFIG } from '@/lib/constants';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_CONFIG.url;
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

  // Stable revision date for legal and company static pages
  const legalPagesDate = new Date('2026-01-15T00:00:00.000Z');

  // Core static & category routes (Strictly excludes /admin, /search, and /api)
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: latestArticleDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/gaming-news`,
      lastModified: latestArticleDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pc-gaming`,
      lastModified: latestArticleDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/mobile-gaming`,
      lastModified: latestArticleDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/console-gaming`,
      lastModified: latestArticleDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/game-guides`,
      lastModified: latestArticleDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/reviews`,
      lastModified: latestArticleDate,
      changeFrequency: 'weekly',
      priority: 0.85,
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

  // Article individual dynamic routes
  const articleRoutes: MetadataRoute.Sitemap = publishedArticles.map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updatedAt || article.publishedAt),
    changeFrequency: 'monthly',
    priority: article.featured ? 0.9 : 0.75,
  }));

  return [...staticRoutes, ...articleRoutes];
}

