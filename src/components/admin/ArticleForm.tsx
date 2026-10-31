'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  Send,
  Clock,
  ArrowLeft,
  Sparkles,
  Tag as TagIcon,
  X,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Article, CategorySlug } from '@/types/article';
import { ArticleFormData } from '@/types/admin';
import { CATEGORIES } from '@/data/categories';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { MediaPickerModal } from '@/components/admin/MediaPickerModal';
import { SeoSnippetPreview } from '@/components/admin/SeoSnippetPreview';
import { SeoAnalysisPanel } from '@/components/admin/SeoAnalysisPanel';
import { EditorialChecklist } from '@/components/admin/EditorialChecklist';
import { InternalLinkSuggester } from '@/components/admin/InternalLinkSuggester';
import { generateSlug, saveArticle } from '@/lib/admin/articleService';
import { useAuth } from '@/lib/auth/authContext';

interface ArticleFormProps {
  initialArticle?: Article;
  isEditMode?: boolean;
}

export function ArticleForm({ initialArticle, isEditMode = false }: ArticleFormProps) {
  const router = useRouter();
  const { isDemoMode } = useAuth();

  // Form State
  const [title, setTitle] = useState(initialArticle?.title || '');
  const [slug, setSlug] = useState(initialArticle?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialArticle?.slug));
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt || '');
  const [content, setContent] = useState(initialArticle?.content || '');
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle?.featuredImage || '/images/articles/placeholder-tech.svg'
  );
  const [imageAlt, setImageAlt] = useState(initialArticle?.imageAlt || '');
  const [category, setCategory] = useState<CategorySlug>(
    initialArticle?.category || 'gaming-news'
  );
  const [authorName, setAuthorName] = useState(initialArticle?.author.name || 'Elena Rostova');
  const [authorRole, setAuthorRole] = useState(
    initialArticle?.author.role || 'Senior Tech & Hardware Editor'
  );
  const [tags, setTags] = useState<string[]>(initialArticle?.tags || ['PC Gaming', 'Hardware']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>(
    initialArticle?.status || 'draft'
  );
  const [featured, setFeatured] = useState<boolean>(initialArticle?.featured || false);
  const [scheduledAt, setScheduledAt] = useState<string>(
    initialArticle?.publishedAt ? new Date(initialArticle.publishedAt).toISOString().slice(0, 16) : ''
  );
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle || '');
  const [metaDescription, setMetaDescription] = useState(initialArticle?.metaDescription || '');
  const [editorialChecklist, setEditorialChecklist] = useState<Record<string, boolean>>(
    initialArticle?.editorialChecklist || {}
  );

  // UI state — article editor tab
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'links' | 'checklist'>('content');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-slug generation from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  // Add Tag
  const handleAddTag = () => {
    const clean = tagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleMediaSelected = (url: string, alt?: string) => {
    setFeaturedImage(url);
    if (alt && !imageAlt) {
      setImageAlt(alt);
    }
  };

  // Submit Handler
  const handleSave = async (targetStatus?: 'draft' | 'published' | 'scheduled') => {
    const finalStatus = targetStatus || status;
    setStatus(finalStatus);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Basic Validation
    if (!title.trim()) {
      setErrorMessage('Please enter an article title.');
      return;
    }
    if (!slug.trim()) {
      setErrorMessage('Please provide a valid URL slug.');
      return;
    }
    if (!excerpt.trim()) {
      setErrorMessage('Please provide an article summary excerpt.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Article content cannot be empty.');
      return;
    }
    if (finalStatus === 'scheduled' && !scheduledAt) {
      setErrorMessage('Please pick a future scheduled release date.');
      return;
    }

    setIsSubmitting(true);

    const formData: ArticleFormData = {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      imageAlt: imageAlt || title,
      category,
      authorName,
      authorRole,
      tags,
      status: finalStatus,
      featured,
      scheduledAt: finalStatus === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || excerpt,
      editorialChecklist,
    };

    const result = await saveArticle(formData, initialArticle?.id);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(
        isEditMode
          ? `Article updated successfully! Status: ${finalStatus.toUpperCase()}`
          : `Article created successfully! Status: ${finalStatus.toUpperCase()}`
      );
      setTimeout(() => {
        router.push('/admin/articles');
      }, 1200);
    } else {
      setErrorMessage(result.error || 'Failed to save article.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top breadcrumb & back */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/admin/articles"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        {isDemoMode && (
          <span className="text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Local Demo Persistence Active</span>
          </span>
        )}
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Left editor fields (8 cols) + Right publishing sidebar (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tabbed editor workspace */}
        <div className="lg:col-span-8 space-y-6">

          {/* Always-visible: Title / Slug / Excerpt */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                Article Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Next-Generation Graphics Pipelines: How Mesh Shading Transforms Open-World Rendering"
                className="w-full px-4 py-3 bg-[#090B12] border border-[#272B3A] rounded-xl text-[#F8FAFC] text-base font-semibold placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>

            {/* URL Slug */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  URL Slug <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(generateSlug(title));
                    setSlugManuallyEdited(false);
                  }}
                  className="text-[11px] text-[#38BDF8] hover:text-[#8B5CF6] transition-colors"
                >
                  Regenerate from Title
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#171C2B] border border-r-0 border-[#272B3A] rounded-l-xl text-xs text-[#A1A1AA] font-mono shrink-0">
                  /articles/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(generateSlug(e.target.value));
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="next-gen-graphics-mesh-shading"
                  className="w-full px-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-r-xl text-xs font-mono text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            {/* Short Excerpt */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-1.5">
                Article Summary / Excerpt <span className="text-red-400">*</span>
              </label>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief editorial summary shown on homepage cards, search results, and article headers..."
                className="w-full px-4 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Tabbed Workspace */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl overflow-hidden">
            {/* Tab Nav */}
            <div className="flex border-b border-[#272B3A]">
              {(
                [
                  { id: 'content', label: 'Content Editor' },
                  { id: 'seo', label: 'SEO & Preview' },
                  { id: 'links', label: 'Internal Links' },
                  { id: 'checklist', label: 'Editorial Review' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs font-semibold transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-[#8B5CF6] text-[#F8FAFC] bg-[#111522]'
                      : 'border-transparent text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#090B12]/50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Content Editor Tab */}
              {activeTab === 'content' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                      Article Content (Rich Text &amp; Headings) <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs text-[#38BDF8]">Markdown &amp; HTML Compatible</span>
                  </div>
                  <RichTextEditor
                    content={content}
                    onChange={(newHtml) => setContent(newHtml)}
                  />
                </div>
              )}

              {/* SEO & Preview Tab */}
              {activeTab === 'seo' && (
                <div className="space-y-6">
                  {/* SEO Analysis Panel (real-time checks) */}
                  <SeoAnalysisPanel
                    title={title}
                    seoTitle={seoTitle}
                    metaDescription={metaDescription}
                    excerpt={excerpt}
                    slug={slug}
                    content={content}
                    featuredImage={featuredImage}
                    imageAlt={imageAlt}
                    category={category}
                    authorName={authorName}
                  />

                  {/* SEO Title & Meta Description fields */}
                  <div className="space-y-4 p-5 bg-[#090B12] rounded-xl border border-[#272B3A]">
                    <h4 className="text-sm font-bold text-[#F8FAFC]">Search Engine Fields</h4>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#A1A1AA]">
                          Custom SEO Title Tag (Optional override)
                        </label>
                        <span className={`text-[10px] font-bold ${(seoTitle || title).length > 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {(seoTitle || title).length}/65
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder={title || 'Leave blank to use Article Title'}
                        maxLength={70}
                        className="w-full px-4 py-2.5 bg-[#111522] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-[#A1A1AA]">
                          Custom Meta Description (Optional override)
                        </label>
                        <span className={`text-[10px] font-bold ${(metaDescription || excerpt).length > 160 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {(metaDescription || excerpt).length}/160
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder={excerpt || 'Leave blank to use Article Excerpt'}
                        maxLength={170}
                        className="w-full px-4 py-2.5 bg-[#111522] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-hidden focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>

                  {/* SERP Snippet Preview */}
                  <SeoSnippetPreview
                    title={seoTitle || title}
                    slug={slug}
                    metaDescription={metaDescription || excerpt}
                  />
                </div>
              )}

              {/* Internal Links Tab */}
              {activeTab === 'links' && (
                <InternalLinkSuggester
                  currentSlug={slug}
                  currentCategory={category}
                  currentTags={tags}
                  content={content}
                />
              )}

              {/* Editorial Checklist Tab */}
              {activeTab === 'checklist' && (
                <EditorialChecklist
                  values={editorialChecklist}
                  onChange={setEditorialChecklist}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar: Publishing Controls, Meta, Featured Image, Tags */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-20">
          {/* Publishing Action Box */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-[#F8FAFC] pb-2 border-b border-[#272B3A]">
              Publishing Workflow
            </h3>

            {/* Status Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Publication Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value="draft">Draft (Private to Editors)</option>
                <option value="published">Published (Live Publicly)</option>
                <option value="scheduled">Scheduled (Timed Release)</option>
              </select>
            </div>

            {/* Scheduled Date Picker */}
            {status === 'scheduled' && (
              <div className="p-3 rounded-xl bg-[#171C2B] border border-[#272B3A] space-y-1.5">
                <label className="block text-xs font-semibold text-[#38BDF8]">
                  Release Date &amp; Time
                </label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#090B12] border border-[#272B3A] rounded-lg text-xs text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            )}

            {/* Featured toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded-sm border-[#272B3A] bg-[#090B12] text-[#8B5CF6] focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-medium text-[#F8FAFC]">
                Mark as Featured Story (Homepage Hero)
              </span>
            </label>

            {/* Workflow Buttons */}
            <div className="pt-3 border-t border-[#272B3A] space-y-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSave(status === 'draft' ? 'draft' : status)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20 disabled:opacity-50"
              >
                {status === 'published' ? (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Publish Article'}</span>
                  </>
                ) : status === 'scheduled' ? (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>{isSubmitting ? 'Scheduling...' : 'Schedule Article'}</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSubmitting ? 'Saving...' : 'Save Draft'}</span>
                  </>
                )}
              </button>

              {status !== 'draft' && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleSave('draft')}
                  className="w-full px-4 py-2 rounded-xl bg-[#171C2B] hover:bg-[#272B3A] text-xs font-semibold text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#272B3A] transition-colors"
                >
                  Save as Draft Instead
                </button>
              )}
            </div>
          </div>

          {/* Category & Author Settings */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-[#F8FAFC] pb-2 border-b border-[#272B3A]">
              Taxonomy &amp; Byline
            </h3>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Editorial Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CategorySlug)}
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs font-semibold text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6] cursor-pointer"
              >
                {Object.values(CATEGORIES).map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Name */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Author Byline
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Elena Rostova"
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>

            {/* Author Role */}
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Author Role / Title
              </label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="Senior Tech Editor"
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Featured Image Box */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#272B3A]">
              <h3 className="text-sm font-bold text-[#F8FAFC]">Featured Thumbnail</h3>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="text-xs font-semibold text-[#8B5CF6] hover:text-[#38BDF8] transition-colors"
              >
                Choose from Library
              </button>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#090B12] border border-[#272B3A]">
              <Image
                src={featuredImage}
                alt={imageAlt || 'Featured thumbnail preview'}
                fill
                sizes="(max-width: 640px) 100vw, 30vw"
                className="object-cover"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1">
                Image Alt Text <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descriptive accessibility alt text..."
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Tags Box */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#F8FAFC] pb-2 border-b border-[#272B3A]">
              Tags
            </h3>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag and press Enter..."
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 bg-[#171C2B] hover:bg-[#8B5CF6] text-xs font-semibold text-[#F8FAFC] rounded-xl border border-[#272B3A] transition-colors shrink-0"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#171C2B] text-xs font-medium text-[#A1A1AA] border border-[#272B3A]"
                >
                  <TagIcon className="w-3 h-3 text-[#8B5CF6]" />
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 ml-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={mediaPickerOpen}
        onSelect={handleMediaSelected}
        onClose={() => setMediaPickerOpen(false)}
      />
    </div>
  );
}
