import { SITE_URL } from '@/lib/site';

/**
 * Site-wide configuration and SEO constants
 * Single source of truth — all URLs derive from SITE_URL in lib/site.ts
 */

export const SITE_CONFIG = {
  name: 'Soft Gamer',
  title: 'Soft Gamer — Gaming News, Guides & Reviews',
  description:
    'In-depth gaming news, game guides, mobile gaming coverage, and honest reviews for gamers worldwide.',
  url: SITE_URL,
  canonicalDomain: 'www.softgamer.online',
  publisher: {
    name: 'Soft Gamer Editorial',
    legalName: 'Soft Gamer Publishing',
    logo: '/images/og-default.png',
    email: process.env.CONTACT_EMAIL || 'umerjamil126@gmail.com',
    contactEmail: process.env.CONTACT_EMAIL || 'umerjamil126@gmail.com',
  },
  editorialDescription:
    'Soft Gamer is an independent gaming publication covering the latest news, in-depth guides, and honest reviews across PC, console, and mobile gaming.',
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
  return `${SITE_URL}${cleanPath}`;
}

/**
 * Ensures image URLs are resolved to absolute URLs for OpenGraph and Structured Data
 */
export function getAbsoluteImageUrl(imageUrl: string): string {
  if (!imageUrl) return `${SITE_URL}/images/og-default.png`;
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const cleanPath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${SITE_URL}${cleanPath}`;
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
