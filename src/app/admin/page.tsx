'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Clock,
  Plus,
  ArrowRight,
  FolderTree,
  ImageIcon,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getDashboardMetrics, getAdminArticles } from '@/lib/admin/articleService';
import { DashboardMetrics } from '@/types/admin';
import { Article } from '@/types/article';
import { formatDate } from '@/lib/constants';
import { useAuth } from '@/lib/auth/authContext';

export default function AdminDashboardPage() {
  const { isDemoMode } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    scheduledArticles: 0,
    totalCategories: 6,
    totalMediaItems: 7,
  });
  const [recentArticles, setRecentArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardMetrics(), getAdminArticles()]).then(
      ([metricsData, articlesData]) => {
        setMetrics(metricsData);
        setRecentArticles(articlesData.slice(0, 5));
        setIsLoading(false);
      }
    );
  }, []);

  return (
    <AdminLayout pageTitle="Dashboard Overview">
      <div className="space-y-8">
        {/* Top Welcome & Demo Banner */}
        {isDemoMode && (
          <div className="p-5 rounded-2xl bg-linear-to-r from-[#171C2B] to-[#111522] border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#F8FAFC]">
                  Phase 3 CMS Interactive Demo Mode Active
                </h3>
                <p className="text-xs text-[#A1A1AA] mt-0.5 leading-relaxed">
                  The dashboard operates on local browser state. All editorial workflows (drafting, editing, previewing, and scheduling) are fully testable. Connect your Supabase project in Phase 3 Settings for persistent cloud database storage.
                </p>
              </div>
            </div>

            <Link
              href="/admin/settings"
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#171C2B] hover:bg-[#272B3A] text-amber-300 border border-amber-500/30 transition-colors shrink-0 text-center"
            >
              View Connection Checklist
            </Link>
          </div>
        )}

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Articles */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Total Articles</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mt-1">
                {isLoading ? '...' : metrics.totalArticles}
              </h3>
              <p className="text-[11px] text-[#38BDF8] mt-1">Across all categories</p>
            </div>
            <div className="p-3 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          {/* Published Articles */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Published</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">
                {isLoading ? '...' : metrics.publishedArticles}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-1">Live in public feeds</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>

          {/* Draft Articles */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Drafts</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">
                {isLoading ? '...' : metrics.draftArticles}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-1">Private to editorial desk</p>
            </div>
            <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileEdit className="w-6 h-6" />
            </div>
          </div>

          {/* Scheduled Articles */}
          <div className="p-5 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">Scheduled</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#38BDF8] mt-1">
                {isLoading ? '...' : metrics.scheduledArticles}
              </h3>
              <p className="text-[11px] text-[#A1A1AA] mt-1">Auto-release queued</p>
            </div>
            <div className="p-3 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Quick Action Hub */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/admin/articles/new"
            className="group p-5 rounded-2xl bg-[#111522] border border-[#272B3A] hover:border-[#8B5CF6] transition-all flex items-center gap-4 hover:shadow-lg hover:shadow-[#8B5CF6]/10"
          >
            <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Draft New Article
              </h4>
              <p className="text-xs text-[#A1A1AA]">Open rich-text editor</p>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="group p-5 rounded-2xl bg-[#111522] border border-[#272B3A] hover:border-[#8B5CF6] transition-all flex items-center gap-4 hover:shadow-lg hover:shadow-[#8B5CF6]/10"
          >
            <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] border border-[#38BDF8]/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Manage Hubs
              </h4>
              <p className="text-xs text-[#A1A1AA]">Configure editorial categories</p>
            </div>
          </Link>

          <Link
            href="/admin/media"
            className="group p-5 rounded-2xl bg-[#111522] border border-[#272B3A] hover:border-[#8B5CF6] transition-all flex items-center gap-4 hover:shadow-lg hover:shadow-[#8B5CF6]/10"
          >
            <div className="w-12 h-12 rounded-xl bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center justify-center transition-transform group-hover:scale-110">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
                Media Library
              </h4>
              <p className="text-xs text-[#A1A1AA]">Upload &amp; manage assets</p>
            </div>
          </Link>
        </div>

        {/* Recent Articles Table Section */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-[#272B3A] flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Recent Editorial Content</h3>
              <p className="text-xs text-[#A1A1AA]">Latest articles across all statuses</p>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs font-semibold text-[#38BDF8] hover:text-[#8B5CF6] transition-colors flex items-center gap-1 group"
            >
              <span>View All Articles</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#171C2B] text-[#A1A1AA] uppercase tracking-wider text-[11px] border-b border-[#272B3A]">
                <tr>
                  <th className="py-3 px-5">Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Author</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Published / Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#272B3A] text-xs">
                {recentArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-[#171C2B]/50 transition-colors">
                    <td className="py-3.5 px-5 font-semibold text-[#F8FAFC] max-w-xs truncate">
                      {article.title}
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      <span className="px-2 py-0.5 rounded bg-[#171C2B] border border-[#272B3A] text-[11px]">
                        {article.categoryName}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {article.author.name}
                    </td>
                    <td className="py-3.5 px-4">
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
                    <td className="py-3.5 px-4 text-[#A1A1AA]">
                      {formatDate(article.publishedAt)}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[#A1A1AA] hover:text-[#38BDF8] hover:bg-[#171C2B] transition-colors"
                          title="View on site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="px-2.5 py-1 rounded bg-[#171C2B] hover:bg-[#8B5CF6] text-[#F8FAFC] font-semibold text-[11px] transition-colors"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

