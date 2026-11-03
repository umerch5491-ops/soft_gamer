import { SITE_CONFIG, getCanonicalUrl, getAbsoluteImageUrl } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';
import { Article } from '@/types/article';

/**
 * Structured Data (Schema.org JSON-LD) Generator for Soft Gamer
 * Uses single source of truth SITE_URL for all absolute entity IDs and URLs.
 */

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_URL,
    description: SITE_CONFIG.description,
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_CONFIG.publisher.name,
    legalName: SITE_CONFIG.publisher.legalName,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: getAbsoluteImageUrl(SITE_CONFIG.publisher.logo),
      width: 1200,
      height: 630,
    },
    email: SITE_CONFIG.publisher.contactEmail,
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const itemListElement = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: SITE_URL,
    },
    ...items.map((item, index) => {
      const position = index + 2;
      const element: {
        '@type': string;
        position: number;
        name: string;
        item?: string;
      } = {
        '@type': 'ListItem',
        position,
        name: item.label,
      };

      if (item.href) {
        element.item = getCanonicalUrl(item.href);
      }

      return element;
    }),
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

export function generateArticleSchema(article: Article) {
  const articleUrl = getCanonicalUrl(`/articles/${article.slug}`);
  const featuredImageUrl = getAbsoluteImageUrl(article.featuredImage);
  const authorUrl = getCanonicalUrl(`/author/${article.author.slug || 'umer-jamil'}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${articleUrl}/#article`,
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    headline: article.title,
    description: article.metaDescription || article.excerpt,
    image: [featuredImageUrl],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
    author: [
      {
        '@type': 'Person',
        name: article.author.name,
        jobTitle: article.author.role,
        url: authorUrl,
        image: article.author.avatar ? getAbsoluteImageUrl(article.author.avatar) : undefined,
      },
    ],
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: SITE_CONFIG.publisher.name,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: getAbsoluteImageUrl(SITE_CONFIG.publisher.logo),
      },
    },
    articleSection: article.categoryName,
    keywords: article.tags?.join(', '),
  };
}
