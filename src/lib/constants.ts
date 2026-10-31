/**
 * Site-wide configuration and SEO constants
 */

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const normalizedSiteUrl = rawSiteUrl && rawSiteUrl.length > 0 && !rawSiteUrl.includes('localhost')
  ? rawSiteUrl.replace(/\/+$/, '')
  : (process.env.NODE_ENV === 'production' ? 'https://softgamer.dev' : 'http://localhost:3000');

export const SITE_CONFIG = {
  name: 'Soft Gamer',
  title: 'Soft Gamer — Premium Gaming News, Guides, Reviews & Tech Analysis',
  description: 'In-depth gaming news, PC hardware analysis, console breakthroughs, game guides, and editorial reviews for passionate gamers worldwide.',
  url: normalizedSiteUrl,
  canonicalDomain: 'softgamer.dev',
  publisher: {
    name: 'Soft Gamer Editorial',
    legalName: 'Soft Gamer Publishing',
    logo: '/images/og-default.svg',
    email: 'editorial@softgamer.dev',
    contactEmail: 'contact@softgamer.dev',
  },
  editorialDescription: 'Soft Gamer is an independent gaming publication dedicated to delivering high-signal editorial commentary, system architecture deep-dives, competitive gameplay guides, and unbiased reviews.',
  copyrightNotice: `© ${new Date().getFullYear()} Soft Gamer. All rights reserved.`,
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Gaming News', href: '/gaming-news' },
    { label: 'PC Gaming', href: '/pc-gaming' },
    { label: 'Mobile Gaming', href: '/mobile-gaming' },
    { label: 'Console Gaming', href: '/console-gaming' },
    { label: 'Game Guides', href: '/game-guides' },
    { label: 'Reviews', href: '/reviews' },
  ],
  footerLinks: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
    { label: 'Terms & Conditions', href: '/terms-and-conditions' },
    { label: 'Disclaimer', href: '/disclaimer' },
  ],
};

/**
 * Returns a clean canonical URL for a given relative or absolute path
 */
export function getCanonicalUrl(path: string = ''): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

/**
 * Ensures image URLs are resolved to absolute paths for OpenGraph and Structured Data
 */
export function getAbsoluteImageUrl(imageUrl: string): string {
  if (!imageUrl) return `${SITE_CONFIG.url}/images/og-default.svg`;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${SITE_CONFIG.url}${cleanPath}`;
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

