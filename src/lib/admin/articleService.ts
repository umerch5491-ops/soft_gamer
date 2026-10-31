import { Article, CategorySlug } from '@/types/article';
import { ArticleFormData, DashboardMetrics } from '@/types/admin';
import { SAMPLE_ARTICLES } from '@/data/sampleArticles';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { DbArticle, Database } from '@/types/database';

const LOCAL_STORAGE_ARTICLES_KEY = 'softgamer_admin_demo_articles';

/**
 * Loads demo articles from browser storage or initial seed data
 */
function getDemoArticles(): Article[] {
  if (typeof window === 'undefined') return [...SAMPLE_ARTICLES];
  const stored = localStorage.getItem(LOCAL_STORAGE_ARTICLES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [...SAMPLE_ARTICLES];
    }
  }
  localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(SAMPLE_ARTICLES));
  return [...SAMPLE_ARTICLES];
}

function saveDemoArticles(articles: Article[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_ARTICLES_KEY, JSON.stringify(articles));
  }
}

/**
 * Generate a clean, SEO-friendly URL slug from article title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculates reading time estimate
 */
export function calculateReadTime(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const articles = await getAdminArticles();
  
  const totalArticles = articles.length;
  const publishedArticles = articles.filter(a => a.status === 'published').length;
  const draftArticles = articles.filter(a => a.status === 'draft').length;
  const scheduledArticles = articles.filter(a => a.status === 'scheduled').length;

  return {
    totalArticles,
    publishedArticles,
    draftArticles,
    scheduledArticles,
    totalCategories: 6,
    totalMediaItems: 12,
  };
}

export async function getAdminArticles(): Promise<Article[]> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          *,
          category:categories(*),
          author:authors(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('[Supabase Admin Error getAdminArticles]:', error.message);
        return getDemoArticles();
      }

      return (data as unknown as DbArticle[]).map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        excerpt: row.excerpt,
        content: row.content,
        category: (row.category?.slug as CategorySlug) || 'gaming-news',
        categoryName: row.category?.name || 'Gaming News',
        author: {
          name: row.author?.name || 'Staff Writer',
          role: row.author?.bio || 'Editor',
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
      }));
    } catch (err) {
      console.error('[Admin Query Error]:', err);
      return getDemoArticles();
    }
  }

  return getDemoArticles();
}

export async function getAdminArticleById(id: string): Promise<Article | null> {
  const articles = await getAdminArticles();
  return articles.find(a => a.id === id || a.slug === id) || null;
}

export async function saveArticle(
  formData: ArticleFormData,
  existingId?: string
): Promise<{ success: boolean; article?: Article; error?: string }> {
  // Validation
  if (!formData.title.trim()) {
    return { success: false, error: 'Article title is required' };
  }
  if (!formData.slug.trim()) {
    return { success: false, error: 'Article URL slug is required' };
  }
  if (!formData.excerpt.trim()) {
    return { success: false, error: 'Article excerpt is required' };
  }
  if (!formData.content.trim()) {
    return { success: false, error: 'Article content cannot be empty' };
  }
  if (!formData.featuredImage.trim()) {
    return { success: false, error: 'Featured image is required' };
  }

  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    try {
      // In production Supabase flow: resolve foreign key UUIDs
      let resolvedCategoryId: string = formData.category;
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(resolvedCategoryId)) {
        const { data: catRow } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', formData.category)
          .maybeSingle();
        if (catRow && 'id' in catRow) {
          resolvedCategoryId = (catRow as { id: string }).id;
        }
      }

      let resolvedAuthorId: string = formData.authorName;
      if (!uuidRegex.test(resolvedAuthorId)) {
        const { data: authRow } = await supabase
          .from('authors')
          .select('id')
          .ilike('name', formData.authorName.trim())
          .maybeSingle();
        if (authRow && 'id' in authRow) {
          resolvedAuthorId = (authRow as { id: string }).id;
        } else {
          const { data: fallbackAuth } = await supabase
            .from('authors')
            .select('id')
            .limit(1)
            .maybeSingle();
          if (fallbackAuth && 'id' in fallbackAuth) {
            resolvedAuthorId = (fallbackAuth as { id: string }).id;
          }
        }
      }

      const articlePayload: Database['public']['Tables']['articles']['Insert'] = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        featured_image: formData.featuredImage,
        image_alt: formData.imageAlt || formData.title,
        category_id: resolvedCategoryId,
        author_id: resolvedAuthorId,
        seo_title: formData.seoTitle || formData.title,
        meta_description: formData.metaDescription || formData.excerpt,
        tags: formData.tags,
        status: formData.status,
        featured: formData.featured,
        published_at: formData.scheduledAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (existingId) {
        const query = supabase.from('articles') as unknown as {
          update: (payload: unknown) => { eq: (col: string, val: string) => Promise<{ error: { message: string } | null }> };
        };
        const { error } = await query
          .update(articlePayload)
          .eq('id', existingId);

        if (error) return { success: false, error: error.message };
      } else {
        const query = supabase.from('articles') as unknown as {
          insert: (payload: unknown) => Promise<{ error: { message: string } | null }>;
        };
        const { error } = await query
          .insert(articlePayload);

        if (error) return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Database error';
      return { success: false, error: errorMsg };
    }
  }

  // Demo Mode Local State Workflow
  const articles = getDemoArticles();
  
  if (existingId) {
    const index = articles.findIndex(a => a.id === existingId);
    if (index === -1) {
      return { success: false, error: 'Article not found' };
    }

    const updated: Article = {
      ...articles[index],
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: formData.featuredImage,
      imageAlt: formData.imageAlt || formData.title,
      category: formData.category,
      categoryName: formData.category.replace('-', ' ').toUpperCase(),
      author: {
        name: formData.authorName || 'Elena Rostova',
        role: formData.authorRole || 'Senior Tech Editor',
      },
      tags: formData.tags,
      status: formData.status,
      featured: formData.featured,
      updatedAt: new Date().toISOString(),
      readTime: calculateReadTime(formData.content),
      seoTitle: formData.seoTitle,
      metaDescription: formData.metaDescription,
      editorialChecklist: formData.editorialChecklist,
    };

    articles[index] = updated;
    saveDemoArticles(articles);
    return { success: true, article: updated };
  } else {
    // Check duplicate slug in demo mode
    if (articles.some(a => a.slug === formData.slug)) {
      formData.slug = `${formData.slug}-${Date.now().toString().slice(-4)}`;
    }

    const newArticle: Article = {
      id: 'art-' + Date.now(),
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      featuredImage: formData.featuredImage,
      imageAlt: formData.imageAlt || formData.title,
      category: formData.category,
      categoryName: formData.category.replace('-', ' ').toUpperCase(),
      author: {
        name: formData.authorName || 'Elena Rostova',
        role: formData.authorRole || 'Senior Tech Editor',
      },
      tags: formData.tags,
      status: formData.status,
      featured: formData.featured,
      publishedAt: formData.scheduledAt || new Date().toISOString(),
      readTime: calculateReadTime(formData.content),
      seoTitle: formData.seoTitle,
      metaDescription: formData.metaDescription,
      editorialChecklist: formData.editorialChecklist,
    };

    articles.unshift(newArticle);
    saveDemoArticles(articles);
    return { success: true, article: newArticle };
  }
}

export async function deleteArticle(id: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseClient();
  if (supabase && isSupabaseConfigured()) {
    const { error } = await supabase.from('articles').delete().eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Demo mode
  const articles = getDemoArticles();
  const filtered = articles.filter(a => a.id !== id && a.slug !== id);
  saveDemoArticles(filtered);
  return { success: true };
}
