'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  FileText,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import {
  getAdminCategories,
  saveAdminCategory,
  deleteAdminCategory,
} from '@/lib/admin/categoryService';
import { AdminCategory } from '@/types/admin';
import { CategorySlug } from '@/types/article';
import { generateSlug } from '@/lib/admin/articleService';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [badgeColor, setBadgeColor] = useState('#8B5CF6');

  // Deletion modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const refreshCategories = async () => {
    setIsLoading(true);
    const data = await getAdminCategories();
    setCategories(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    getAdminCategories().then((data) => {
      if (mounted) {
        setCategories(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setDescription('');
    setBadgeColor('#8B5CF6');
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const openEditModal = (cat: AdminCategory) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setBadgeColor(cat.badgeColor);
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    const result = await saveAdminCategory(
      {
        name,
        slug: slug as CategorySlug,
        description,
        badgeColor,
      },
      editingId || undefined
    );

    if (result.success) {
      setIsModalOpen(false);
      setStatusMessage({
        type: 'success',
        text: editingId ? 'Category updated successfully!' : 'Category created successfully!',
      });
      await refreshCategories();
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to save category',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    const result = await deleteAdminCategory(deleteTarget.id);
    setDeleteTarget(null);

    if (result.success) {
      setStatusMessage({ type: 'success', text: 'Category deleted successfully.' });
      await refreshCategories();
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Failed to delete category.' });
    }
  };

  return (
    <AdminLayout pageTitle="Category Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
              Editorial Categories &amp; Hubs
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              Configure content verticals, badges, descriptions, and URL routing slugs.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Category</span>
          </button>
        </div>

        {/* Notifications */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs sm:text-sm flex items-center gap-2 ${
              statusMessage.type === 'error'
                ? 'bg-red-500/10 border border-red-500/20 text-red-400'
                : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}
          >
            {statusMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Category Table */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#171C2B] text-[#A1A1AA] uppercase tracking-wider text-[11px] border-b border-[#272B3A]">
                <tr>
                  <th className="py-3.5 px-5">Category Name</th>
                  <th className="py-3.5 px-4">Slug</th>
                  <th className="py-3.5 px-4">Description</th>
                  <th className="py-3.5 px-4">Articles</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272B3A]">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#A1A1AA]">
                      Loading categories...
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-[#171C2B]/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat.badgeColor }}
                          />
                          <span className="font-bold text-[#F8FAFC]">{cat.name}</span>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-mono text-xs text-[#38BDF8]">
                        /{cat.slug}
                      </td>

                      <td className="py-4 px-4 text-[#A1A1AA] max-w-sm truncate text-xs">
                        {cat.description}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#171C2B] text-xs font-semibold text-[#F8FAFC] border border-[#272B3A]">
                          <FileText className="w-3.5 h-3.5 text-[#8B5CF6]" />
                          <span>{cat.articleCount} articles</span>
                        </span>
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(cat)}
                            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#8B5CF6] hover:bg-[#171C2B] transition-colors"
                            title="Edit Category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(cat)}
                            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Category"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Category Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#111522] border border-[#272B3A] rounded-2xl p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-4 pb-2 border-b border-[#272B3A]">
              {editingId ? 'Edit Editorial Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  Category Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingId) setSlug(generateSlug(e.target.value));
                  }}
                  placeholder="e.g. Esports & Tournaments"
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="esports-tournaments"
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs font-mono text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  Editorial Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Overview of articles and coverage included under this vertical..."
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-[#272B3A] bg-transparent cursor-pointer p-0.5"
                  />
                  <span className="text-xs font-mono text-[#A1A1AA]">{badgeColor}</span>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-[#272B3A]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#171C2B] text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#272B3A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white transition-colors shadow-md shadow-[#8B5CF6]/20"
                >
                  {editingId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Article Count Protection */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Confirm Category Deletion"
        message={
          deleteTarget && deleteTarget.articleCount > 0
            ? `Protected action: "${deleteTarget.name}" currently contains ${deleteTarget.articleCount} article(s). You must reassign or remove those articles before deleting this category.`
            : `Are you sure you want to delete the category "${deleteTarget?.name}"?`
        }
        confirmLabel={deleteTarget && deleteTarget.articleCount > 0 ? 'Cannot Delete' : 'Delete Category'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
