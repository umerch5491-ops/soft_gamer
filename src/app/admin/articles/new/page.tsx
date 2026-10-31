'use client';

import { AdminLayout } from '@/components/admin/AdminLayout';
import { ArticleForm } from '@/components/admin/ArticleForm';

export default function AdminNewArticlePage() {
  return (
    <AdminLayout pageTitle="Compose New Article">
      <div className="max-w-6xl mx-auto">
        <ArticleForm />
      </div>
    </AdminLayout>
  );
}

