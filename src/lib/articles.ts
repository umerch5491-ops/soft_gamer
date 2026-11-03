import { Article, CategorySlug, Author } from '@/types/article';
import { SAMPLE_ARTICLES } from '@/data/sampleArticles';
import { CATEGORIES } from '@/data/categories';
import { getSupabaseClient } from '@/lib/supabase';
import { DbArticle, DbAuthor } from '@/types/database';

/**
 * Calculates human-readable read time from word count
 */
function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatAuthor(dbAuthor?: DbAuthor | null): Author {
  const rawName = dbAuthor?.name?.trim() || '';
  if (!rawName || rawName.toLowerCase() === 'umerch5491' || rawName.toLowerCase().includes('umerch5491')) {
    return {
      name: 'Umer Jamil',
      role: 'Editor-in-Chief',
      bio: 'Lifelong gamer and tech enthusiast covering hardware benchmarks, gaming news, and competitive guides for Soft Gamer.',
      avatar: dbAuthor?.avatar,
      slug: 'umer-jamil',
    };
  }
  const slug = dbAuthor?.slug || rawName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return {
    name: rawName,
    role: dbAuthor?.bio || 'Staff Writer',
    bio: dbAuthor?.bio || 'Gaming journalist and editorial contributor at Soft Gamer.',
    avatar: dbAuthor?.avatar,
    slug: slug || 'editorial-staff',
  };
}

function normalizeArticle(art: Article): Article {
  const authorName = art.author?.name?.trim() || 'Soft Gamer Editorial Staff';
  const isUmer = authorName.toLowerCase().includes('umerch5491') || authorName.toLowerCase() === 'umerch5491';
  const cleanName = isUmer ? 'Umer Jamil' : authorName;
  const slug = art.author?.slug || (isUmer ? 'umer-jamil' : cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'editorial-staff');
  const role = isUmer ? 'Editor-in-Chief' : (art.author?.role || 'Staff Writer');
  const bio = art.author?.bio || (isUmer
    ? 'Lifelong gamer and tech enthusiast covering hardware benchmarks, gaming news, and competitive guides for Soft Gamer.'
    : 'Gaming journalist and editorial contributor at Soft Gamer.');

  return {
    ...art,
    author: {
      ...art.author,
      name: cleanName,
      role,
      bio,
      slug,
    },
  };
}

/**
 * Maps a relational database row from Supabase into the application's Article model
 */
function mapDbArticleToArticle(row: DbArticle): Article {
  const categorySlug = (row.category?.slug as CategorySlug) || 'gaming-news';
  const categoryMeta = CATEGORIES[categorySlug];

  return normalizeArticle({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: categorySlug,
    categoryName: row.category?.name || categoryMeta?.name || 'Gaming News',
    author: formatAuthor(row.author),
    featuredImage: row.featured_image,
    imageAlt: row.image_alt,
    publishedAt: row.published_at,
    updatedAt: row.updated_at || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    status: row.status,
    featured: Boolean(row.featured),
    readTime: calculateReadTime(row.content),
    seoTitle: row.seo_title || undefined,
    metaDescription: row.meta_description || undefined,
  });
}

/**
 * Data Access Layer (DAL) for Soft Gamer Articles.
 * 
 * Supports dynamic live Supabase queries when credentials are provided,
 * while safely falling back to sample development data when unconfigured.
 * Strictly guarantees that public pages only see published, non-future articles.
 */

export async function getAllArticles(): Promise<Article[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .eq('status', 'published')
        .lte('published_at', now)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('[Supabase DAL Error in getAllArticles]:', error.message);
        return [];
      }

      return (data as unknown as DbArticle[]).map(mapDbArticleToArticle);
    } catch (err) {
      console.error('[Supabase Network/Query Error in getAllArticles]:', err);
      return [];
    }
  }

  // Fallback for development before Supabase project is connected
  return [...SAMPLE_ARTICLES].map(normalizeArticle).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getFeaturedArticles(limit: number = 3): Promise<Article[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .eq('status', 'published')
        .eq('featured', true)
        .lte('published_at', now)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Supabase DAL Error in getFeaturedArticles]:', error.message);
        return [];
      }

      return (data as unknown as DbArticle[]).map(mapDbArticleToArticle);
    } catch (err) {
      console.error('[Supabase Network Error in getFeaturedArticles]:', err);
      return [];
    }
  }

  const all = await getAllArticles();
  return all.filter((art) => art.featured).slice(0, limit);
}

export async function getFeaturedArticle(): Promise<Article | undefined> {
  const featured = await getFeaturedArticles(1);
  if (featured.length > 0) return featured[0];

  const latest = await getLatestArticles(1);
  return latest[0];
}

export async function getLatestArticles(limit: number = 6): Promise<Article[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .eq('status', 'published')
        .lte('published_at', now)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Supabase DAL Error in getLatestArticles]:', error.message);
        return [];
      }

      return (data as unknown as DbArticle[]).map(mapDbArticleToArticle);
    } catch (err) {
      console.error('[Supabase Network Error in getLatestArticles]:', err);
      return [];
    }
  }

  const all = await getAllArticles();
  return all.slice(0, limit);
}

export async function getTrendingArticles(limit: number = 5): Promise<Article[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .eq('status', 'published')
        .lte('published_at', now)
        .order('published_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('[Supabase DAL Error in getTrendingArticles]:', error.message);
        return [];
      }

      return (data as unknown as DbArticle[]).map(mapDbArticleToArticle);
    } catch (err) {
      console.error('[Supabase Network Error in getTrendingArticles]:', err);
      return [];
    }
  }

  const all = await getAllArticles();
  return all
    .filter((art) => art.trendingRank !== undefined)
    .sort((a, b) => (a.trendingRank ?? 99) - (b.trendingRank ?? 99))
    .slice(0, limit);
}

export async function getArticlesByCategory(category: CategorySlug, limit?: number): Promise<Article[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      let query = supabase
        .from('articles')
        .select(`
          *,
          category:categories!inner(*),
          author:authors(*)
        `)
        .eq('status', 'published')
        .eq('category.slug', category)
        .lte('published_at', now)
        .order('published_at', { ascending: false });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) {
        console.error(`[Supabase DAL Error in getArticlesByCategory (${category})]:`, error.message);
        return [];
      }

      return (data as unknown as DbArticle[]).map(mapDbArticleToArticle);
    } catch (err) {
      console.error(`[Supabase Network Error in getArticlesByCategory (${category})]:`, err);
      return [];
    }
  }

  const all = await getAllArticles();
  const filtered = all.filter((art) => art.category === category);
  return limit ? filtered.slice(0, limit) : filtered;
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const decodedSlug = decodeURIComponent(slug).toLowerCase().trim();
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .eq('slug', decodedSlug)
        .eq('status', 'published')
        .lte('published_at', now)
        .maybeSingle();

      if (error) {
        console.error(`[Supabase DAL Error in getArticleBySlug (${slug})]:`, error.message);
        return undefined;
      }

      if (!data) return undefined;
      return mapDbArticleToArticle(data as unknown as DbArticle);
    } catch (err) {
      console.error(`[Supabase Network Error in getArticleBySlug (${slug})]:`, err);
      return undefined;
    }
  }

  const all = await getAllArticles();
  return all.find((art) => art.slug.toLowerCase() === decodedSlug);
}

export async function getRelatedArticles(currentSlug: string, category: CategorySlug, limit: number = 3): Promise<Article[]> {
  const allCategory = await getArticlesByCategory(category, limit + 2);
  const filtered = allCategory.filter((art) => art.slug !== currentSlug);

  if (filtered.length >= limit) {
    return filtered.slice(0, limit);
  }

  // Backfill with other recent articles if fewer articles exist in current category
  const allRecent = await getLatestArticles(limit + 3);
  const additional = allRecent.filter((art) => art.slug !== currentSlug && art.category !== category);

  return [...filtered, ...additional].slice(0, limit);
}

export async function getAdjacentArticles(currentSlug: string): Promise<{ prev?: Article; next?: Article }> {
  const all = await getAllArticles();
  const index = all.findIndex((art) => art.slug === currentSlug);
  if (index === -1) return {};
  return {
    next: index > 0 ? all[index - 1] : undefined, // newer
    prev: index < all.length - 1 ? all[index + 1] : undefined, // older
  };
}

export async function getAuthorBySlug(slug: string): Promise<Author | null> {
  const all = await getAllArticles();
  const match = all.find((art) => art.author.slug === slug);
  if (match) return match.author;
  if (slug === 'umer-jamil') {
    return {
      name: 'Umer Jamil',
      role: 'Editor-in-Chief',
      bio: 'Lifelong gamer and tech enthusiast covering hardware benchmarks, gaming news, and competitive guides for Soft Gamer.',
      slug: 'umer-jamil',
    };
  }
  return null;
}

export async function getArticlesByAuthor(authorSlug: string): Promise<Article[]> {
  const all = await getAllArticles();
  return all.filter((art) => art.author.slug === authorSlug);
}

export async function getAllAuthors(): Promise<Author[]> {
  const all = await getAllArticles();
  const authorsMap = new Map<string, Author>();
  for (const art of all) {
    if (art.author?.slug && !authorsMap.has(art.author.slug)) {
      authorsMap.set(art.author.slug, art.author);
    }
  }
  if (!authorsMap.has('umer-jamil')) {
    authorsMap.set('umer-jamil', {
      name: 'Umer Jamil',
      role: 'Editor-in-Chief',
      bio: 'Lifelong gamer and tech enthusiast covering hardware benchmarks, gaming news, and competitive guides for Soft Gamer.',
      slug: 'umer-jamil',
    });
  }
  return Array.from(authorsMap.values());
}

export async function searchArticles(query: string): Promise<Article[]> {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .eq('status', 'published')
        .lte('published_at', now)
        .or(`title.ilike.%${cleanQuery}%,excerpt.ilike.%${cleanQuery}%,content.ilike.%${cleanQuery}%`)
        .order('published_at', { ascending: false });

      if (error) {
        console.error('[Supabase DAL Error in searchArticles]:', error.message);
        return [];
      }

      return (data as unknown as DbArticle[]).map(mapDbArticleToArticle);
    } catch (err) {
      console.error('[Supabase Network Error in searchArticles]:', err);
      return [];
    }
  }

  const all = await getAllArticles();
  return all.filter((art) => {
    const titleMatch = art.title.toLowerCase().includes(cleanQuery);
    const excerptMatch = art.excerpt.toLowerCase().includes(cleanQuery);
    const contentMatch = art.content.toLowerCase().includes(cleanQuery);
    const tagMatch = art.tags.some((tag) => tag.toLowerCase().includes(cleanQuery));
    const authorMatch = art.author.name.toLowerCase().includes(cleanQuery);
    const categoryMatch = art.categoryName.toLowerCase().includes(cleanQuery);

    return titleMatch || excerptMatch || contentMatch || tagMatch || authorMatch || categoryMatch;
  });
}
