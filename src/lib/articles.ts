import { Article, CategorySlug } from '@/types/article';
import { SAMPLE_ARTICLES } from '@/data/sampleArticles';
import { CATEGORIES } from '@/data/categories';
import { getSupabaseClient } from '@/lib/supabase';
import { DbArticle } from '@/types/database';

/**
 * Calculates human-readable read time from word count
 */
function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Maps a relational database row from Supabase into the application's Article model
 */
function mapDbArticleToArticle(row: DbArticle): Article {
  const categorySlug = (row.category?.slug as CategorySlug) || 'gaming-news';
  const categoryMeta = CATEGORIES[categorySlug];

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    category: categorySlug,
    categoryName: row.category?.name || categoryMeta?.name || 'Gaming News',
    author: {
      name: row.author?.name || 'Soft Gamer Editorial Staff',
      role: row.author?.bio || 'Staff Writer',
      avatar: row.author?.avatar,
    },
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
  };
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
  return [...SAMPLE_ARTICLES].sort(
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
  const all = await getAllArticles();
  // If trending rank is specified on articles, respect it; otherwise sort by latest
  return all
    .filter((art) => art.status === 'published')
    .sort((a, b) => {
      if (typeof a.trendingRank === 'number' && typeof b.trendingRank === 'number') {
        return a.trendingRank - b.trendingRank;
      }
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    })
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

      if (typeof limit === 'number') {
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

  return SAMPLE_ARTICLES.find(
    (art) => art.slug.toLowerCase() === decodedSlug && art.status === 'published'
  );
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

export async function searchArticles(query: string): Promise<Article[]> {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];

  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const now = new Date().toISOString();
      // Safe ilike filter matching title or excerpt
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
