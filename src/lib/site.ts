/**
 * Single source of truth for the site's canonical production URL.
 * Primary domain: https://www.softgamer.online (no trailing slash).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://www.softgamer.online'
).replace(/\/+$/, '');

