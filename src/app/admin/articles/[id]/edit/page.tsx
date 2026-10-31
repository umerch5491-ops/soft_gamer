'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm';
import { getAdminArticleById } from '@/lib/admin/articleService';
import { Article } from '@/types/article';

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function AdminEditArticlePage({ params }: EditArticlePageProps) {
  const resolvedParams = use(params);
  const articleId = resolvedParams.id;

  const [article, setArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminArticleById(articleId).then((data) => {
      setArticle(data);
      setIsLoading(false);
    });
  }, [articleId]);

  return (
    <AdminLayout pageTitle="Edit Editorial Article">
      <div className="max-w-6xl mx-auto">
        {isLoading ? (
          <div className="p-12 text-center text-[#A1A1AA]">
            <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Loading article data...</p>
          </div>
        ) : article ? (
          <ArticleForm initialArticle={article} isEditMode={true} />
        ) : (
          <div className="p-12 text-center bg-[#111522] border border-[#272B3A] rounded-2xl max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-2">Article Not Found</h3>
            <p className="text-xs text-[#A1A1AA] mb-4">
              The article with ID or slug &ldquo;{articleId}&rdquo; could not be located in the current database or local demo store.
            </p>
            <Link
              href="/admin/articles"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Articles</span>
            </Link>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

