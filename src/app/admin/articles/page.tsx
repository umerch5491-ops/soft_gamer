'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ConfirmModal } from '@/components/admin/ConfirmModal';
import { getAdminArticles, deleteArticle } from '@/lib/admin/articleService';
import { Article } from '@/types/article';
import { CATEGORIES } from '@/data/categories';
import { formatDate } from '@/lib/constants';

export default function AdminArticlesListPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc' | 'title'>('date-desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Deletion state
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const refreshArticles = async () => {
    setIsLoading(true);
    const data = await getAdminArticles();
    setArticles(data);
    setIsLoading(false);
  };

  useEffect(() => {
    let mounted = true;
    getAdminArticles().then((data) => {
      if (mounted) {
        setArticles(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Filter & Sort Pipeline
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !searchQuery ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.author.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || article.category === categoryFilter;

    const matchesStatus =
      statusFilter === 'all' || article.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'date-asc') {
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
    }
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedArticles.length / itemsPerPage) || 1;
  const paginatedArticles = sortedArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await deleteArticle(deleteTarget.id);
    setIsDeleting(false);
    setDeleteTarget(null);
    await refreshArticles();
  };

  return (
    <AdminLayout pageTitle="Article Management">
      <div className="space-y-6">
        {/* Header toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
              Editorial Content Library
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA]">
              Search, filter, edit, schedule, and publish articles across Soft Gamer.
            </p>
          </div>

          <Link
            href="/admin/articles/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Article</span>
          </Link>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-[#111522] border border-[#272B3A] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by title, author..."
              className="w-full pl-9 pr-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6]"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
            >
              <option value="all">All Categories</option>
              {Object.values(CATEGORIES).map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc' | 'title')}
              className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="title">Alphabetical (Title)</option>
            </select>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#171C2B] text-[#A1A1AA] uppercase tracking-wider text-[11px] border-b border-[#272B3A]">
                <tr>
                  <th className="py-3.5 px-5">Article Title</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Author</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272B3A]">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#A1A1AA]">
                      Loading articles...
                    </td>
                  </tr>
                ) : paginatedArticles.length > 0 ? (
                  paginatedArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-[#171C2B]/50 transition-colors group">
                      <td className="py-4 px-5">
                        <div className="max-w-md">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-1"
                          >
                            {article.title}
                          </Link>
                          <span className="text-[11px] text-[#A1A1AA] block mt-0.5 font-mono truncate">
                            /{article.slug}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-[#A1A1AA]">
                        <span className="px-2 py-0.5 rounded bg-[#171C2B] border border-[#272B3A] text-xs">
                          {article.categoryName}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[#A1A1AA] whitespace-nowrap">
                        {article.author.name}
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                            article.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : article.status === 'scheduled'
                              ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}
                        >
                          {article.status}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-[#A1A1AA] whitespace-nowrap text-xs">
                        {formatDate(article.publishedAt)}
                      </td>

                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/articles/${article.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#38BDF8] hover:bg-[#171C2B] transition-colors"
                            title="Preview Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#8B5CF6] hover:bg-[#171C2B] transition-colors"
                            title="Edit Article"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(article)}
                            className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#A1A1AA]">
                      <div className="max-w-xs mx-auto">
                        <Filter className="w-8 h-8 text-[#272B3A] mx-auto mb-2" />
                        <p className="font-semibold text-[#F8FAFC]">No Articles Found</p>
                        <p className="text-xs text-[#A1A1AA] mt-1">
                          Try adjusting your search criteria or create a new article.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-[#272B3A] flex items-center justify-between text-xs text-[#A1A1AA]">
              <span>
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, sortedArticles.length)} of{' '}
                {sortedArticles.length} articles
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg bg-[#171C2B] text-[#A1A1AA] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-3 py-1 font-semibold text-[#F8FAFC]">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg bg-[#171C2B] text-[#A1A1AA] hover:text-[#F8FAFC] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTarget)}
        title="Confirm Article Deletion"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel={isDeleting ? 'Deleting...' : 'Delete Article'}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </AdminLayout>
  );
}
