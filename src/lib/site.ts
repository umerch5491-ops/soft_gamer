import { Metadata } from 'next';

/**
 * Single source of truth for the site's canonical production URL.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.softgamer.online'
).replace(/\/$/, '');

/**
 * Converts a relative path into an absolute canonical URL on the primary domain.
 */
export const absoluteUrl = (path: string = '/'): string => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
};

/**
 * High-resolution standard PNG Open Graph banner for social platforms.
 */
export const DEFAULT_OG_IMAGE = absoluteUrl('/images/og-default.png');
export const DEFAULT_OG_IMAGE_ALT = 'Soft Gamer — Gaming News, Guides, Reviews & Hardware Insights';

export interface PageMetadataOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
}

/**
 * Unified metadata builder that guarantees identical, canonical, self-referencing
 * URLs for <link rel="canonical"> and <meta property="og:url"> on every route.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  image,
  imageAlt,
  type = 'website',
  noindex = false,
}: PageMetadataOptions): Metadata {
  const pageUrl = absoluteUrl(path);
  const ogImageUrl = image || DEFAULT_OG_IMAGE;
  const ogImageAlt = imageAlt || DEFAULT_OG_IMAGE_ALT;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: !noindex,
      follow: true,
      googleBot: {
        index: !noindex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'Soft Gamer',
      locale: 'en_US',
      type,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
