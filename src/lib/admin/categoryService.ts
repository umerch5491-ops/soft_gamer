import { AdminCategory } from '@/types/admin';
import { CATEGORIES } from '@/data/categories';
import { CategorySlug } from '@/types/article';
import { getAdminArticles } from '@/lib/admin/articleService';

const LOCAL_STORAGE_CATEGORIES_KEY = 'softgamer_admin_demo_categories';

function getInitialCategories(): AdminCategory[] {
  return Object.values(CATEGORIES).map((cat, index) => ({
    id: `cat-00${index + 1}`,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    badgeColor: cat.badgeColor,
    articleCount: 0,
  }));
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const articles = await getAdminArticles();
  let baseCategories: AdminCategory[] = [];

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
    if (saved) {
      try {
        baseCategories = JSON.parse(saved);
      } catch {
        baseCategories = getInitialCategories();
      }
    } else {
      baseCategories = getInitialCategories();
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(baseCategories));
    }
  } else {
    baseCategories = getInitialCategories();
  }

  // Calculate live article count per category
  return baseCategories.map(cat => ({
    ...cat,
    articleCount: articles.filter(a => a.category === cat.slug).length,
  }));
}

export async function saveAdminCategory(
  category: Omit<AdminCategory, 'id' | 'articleCount'>,
  id?: string
): Promise<{ success: boolean; error?: string }> {
  if (!category.name.trim()) {
    return { success: false, error: 'Category name is required' };
  }
  if (!category.slug.trim()) {
    return { success: false, error: 'Category slug is required' };
  }

  const categories = await getAdminCategories();

  if (id) {
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return { success: false, error: 'Category not found' };
    categories[index] = { ...categories[index], ...category };
  } else {
    if (categories.some(c => c.slug === category.slug)) {
      return { success: false, error: 'A category with this URL slug already exists' };
    }
    categories.push({
      id: 'cat-' + Date.now(),
      name: category.name,
      slug: category.slug as CategorySlug,
      description: category.description,
      badgeColor: category.badgeColor || '#8B5CF6',
      articleCount: 0,
    });
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(categories));
  }

  return { success: true };
}

export async function deleteAdminCategory(id: string): Promise<{ success: boolean; error?: string }> {
  const categories = await getAdminCategories();
  const target = categories.find(c => c.id === id);

  if (!target) {
    return { success: false, error: 'Category not found' };
  }

  // Protection against deleting categories that contain active articles
  if (target.articleCount > 0) {
    return {
      success: false,
      error: `Cannot delete "${target.name}" because it contains ${target.articleCount} article(s). Reassign or delete those articles first.`,
    };
  }

  const filtered = categories.filter(c => c.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(filtered));
  }

  return { success: true };
}

