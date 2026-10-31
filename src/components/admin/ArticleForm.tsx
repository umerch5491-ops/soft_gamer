'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  Send,
  ArrowLeft,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  AlertCircle,
  CheckCircle,
  Tag as TagIcon,
  Clock,
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
import { uploadMediaItem, validateImageFile } from '@/lib/admin/mediaService';
import { useAuth } from '@/lib/auth/authContext';

interface ArticleFormProps {
  initialArticle?: Article;
  isEditMode?: boolean;
}

/** Strip HTML tags to plain text for excerpt auto-generation */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Auto-generate a short excerpt (≤ 200 chars) from content */
function autoExcerpt(content: string): string {
  const plain = htmlToPlainText(content);
  if (plain.length <= 200) return plain;
  const cut = plain.slice(0, 200);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 120 ? cut.slice(0, lastSpace) : cut) + '…';
}

export function ArticleForm({ initialArticle, isEditMode = false }: ArticleFormProps) {
  const router = useRouter();
  const { user, isDemoMode } = useAuth();

  // ── Core form state ──────────────────────────────────────────────────────────
  const [title, setTitle] = useState(initialArticle?.title ?? '');
  const [slug, setSlug] = useState(initialArticle?.slug ?? '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(Boolean(initialArticle?.slug));
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? '');
  const [excerptManuallyEdited, setExcerptManuallyEdited] = useState(Boolean(initialArticle?.excerpt));
  const [content, setContent] = useState(initialArticle?.content ?? '');
  const [featuredImage, setFeaturedImage] = useState(
    initialArticle?.featuredImage ?? '/images/articles/placeholder-tech.svg'
  );
  const [imageAlt, setImageAlt] = useState(initialArticle?.imageAlt ?? '');
  const [category, setCategory] = useState<CategorySlug>(
    initialArticle?.category ?? 'gaming-news'
  );

  // Author: use authenticated user name; allow override in Advanced Settings
  const defaultAuthorName = user?.name ?? initialArticle?.author.name ?? 'Soft Gamer Editor';
  const [authorName, setAuthorName] = useState(initialArticle?.author.name ?? defaultAuthorName);
  const [authorRole, setAuthorRole] = useState(
    initialArticle?.author.role ?? 'Staff Writer'
  );

  // Advanced fields
  const [tags, setTags] = useState<string[]>(initialArticle?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>(
    initialArticle?.status ?? 'draft'
  );
  const [featured, setFeatured] = useState<boolean>(initialArticle?.featured ?? false);
  const [scheduledAt, setScheduledAt] = useState<string>(
    initialArticle?.publishedAt ? new Date(initialArticle.publishedAt).toISOString().slice(0, 16) : ''
  );
  const [seoTitle, setSeoTitle] = useState(initialArticle?.seoTitle ?? '');
  const [metaDescription, setMetaDescription] = useState(initialArticle?.metaDescription ?? '');
  const [editorialChecklist, setEditorialChecklist] = useState<Record<string, boolean>>(
    initialArticle?.editorialChecklist ?? {}
  );

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [advancedTab, setAdvancedTab] = useState<'seo' | 'links' | 'checklist'>('seo');
  const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) setSlug(generateSlug(val));
  };

  const handleContentChange = useCallback((newHtml: string) => {
    setContent(newHtml);
    if (!excerptManuallyEdited && newHtml.trim()) {
      setExcerpt(autoExcerpt(newHtml));
    }
  }, [excerptManuallyEdited]);

  const handleMediaSelected = (url: string, alt?: string) => {
    setFeaturedImage(url);
    if (alt && !imageAlt) setImageAlt(alt);
    setMediaPickerOpen(false);
  };

  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'Invalid file.');
      return;
    }
    setIsImageUploading(true);
    setImageUploadProgress(0);
    setErrorMessage(null);
    const result = await uploadMediaItem(file, imageAlt || file.name, (p) =>
      setImageUploadProgress(p)
    );
    setIsImageUploading(false);
    if (result.success && result.item) {
      setFeaturedImage(result.item.url);
      if (!imageAlt) setImageAlt(result.item.altText);
    } else {
      setErrorMessage(result.error ?? 'Image upload failed.');
    }
    // Reset input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddTag = () => {
    const clean = tagInput.trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSave = async (targetStatus: 'draft' | 'published' | 'scheduled') => {
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!title.trim()) { setErrorMessage('Please enter an article title.'); return; }
    if (!content.trim()) { setErrorMessage('Article content cannot be empty.'); return; }
    if (targetStatus === 'scheduled' && !scheduledAt) {
      setErrorMessage('Please pick a future scheduled release date in Advanced Settings.'); return;
    }

    // Auto-generate slug and excerpt if missing
    const finalSlug = slug.trim() || generateSlug(title);
    const finalExcerpt = excerpt.trim() || autoExcerpt(content) || title;

    setIsSubmitting(true);

    const formData: ArticleFormData = {
      title,
      slug: finalSlug,
      excerpt: finalExcerpt,
      content,
      featuredImage,
      imageAlt: imageAlt || title,
      category,
      authorName: authorName || defaultAuthorName,
      authorRole,
      tags,
      status: targetStatus,
      featured,
      scheduledAt: targetStatus === 'scheduled' ? new Date(scheduledAt).toISOString() : undefined,
      seoTitle: seoTitle || title,
      metaDescription: metaDescription || finalExcerpt,
      editorialChecklist,
    };

    const result = await saveArticle(formData, initialArticle?.id);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMessage(
        isEditMode
          ? `Article updated — ${targetStatus.toUpperCase()}`
          : `Article saved — ${targetStatus.toUpperCase()}`
      );
      setTimeout(() => router.push('/admin/articles'), 1200);
    } else {
      setErrorMessage(result.error ?? 'Failed to save article. Please try again.');
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">

      {/* ── Back link + Demo badge ── */}
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
            <span>Local Demo Mode</span>
          </span>
        )}
      </div>

      {/* ── Notifications ── */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* ══ MAIN CARD ══════════════════════════════════════════════════════════ */}
      <div className="bg-[#111522] border border-[#272B3A] rounded-2xl overflow-hidden">

        {/* ── Article Title ── */}
        <div className="p-6 border-b border-[#272B3A]">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Article title…"
            className="w-full bg-transparent text-[#F8FAFC] text-2xl font-bold placeholder-[#3D4358] focus:outline-none leading-tight"
          />
          {slug && (
            <p className="mt-2 text-xs text-[#A1A1AA] font-mono">
              /articles/<span className="text-[#8B5CF6]">{slug || '…'}</span>
            </p>
          )}
        </div>

        {/* ── Featured Image ── */}
        <div className="p-6 border-b border-[#272B3A] space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">Featured Image</p>

          {/* Preview */}
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-[#090B12] border border-[#272B3A] group">
            <Image
              src={featuredImage}
              alt={imageAlt || 'Featured image preview'}
              fill
              sizes="(max-width: 768px) 100vw, 640px"
              className="object-cover"
            />
            {isImageUploading && (
              <div className="absolute inset-0 bg-[#090B12]/80 flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-[#A1A1AA]">{imageUploadProgress}%</p>
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-2 rounded-lg bg-[#8B5CF6] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload New
              </button>
              <button
                type="button"
                onClick={() => setMediaPickerOpen(true)}
                className="px-3 py-2 rounded-lg bg-[#171C2B] border border-[#272B3A] text-[#F8FAFC] text-xs font-semibold"
              >
                Media Library
              </button>
            </div>
          </div>

          {/* Upload buttons (also visible below preview for clarity) */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isImageUploading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171C2B] border border-[#272B3A] text-[#F8FAFC] text-xs font-semibold hover:border-[#8B5CF6] transition-colors disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {isImageUploading ? 'Uploading…' : 'Upload Image'}
            </button>
            <button
              type="button"
              onClick={() => setMediaPickerOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171C2B] border border-[#272B3A] text-[#A1A1AA] text-xs font-semibold hover:border-[#8B5CF6] hover:text-[#F8FAFC] transition-colors"
            >
              Choose from Library
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/svg+xml"
            className="hidden"
            onChange={handleDirectUpload}
          />
        </div>

        {/* ── Category ── */}
        <div className="p-6 border-b border-[#272B3A]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-2">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as CategorySlug)}
            className="w-full px-4 py-3 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6] cursor-pointer transition-colors"
          >
            {Object.values(CATEGORIES).map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* ── Content Editor ── */}
        <div className="p-6 border-b border-[#272B3A]">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-3">
            Article Content
          </label>
          <RichTextEditor
            content={content}
            onChange={handleContentChange}
          />
        </div>

        {/* ── Action Buttons ── */}
        <div className="p-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={() => handleSave('published')}
            disabled={isSubmitting}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-sm font-bold transition-all shadow-lg shadow-[#8B5CF6]/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? 'Saving…' : 'Publish Article'}
          </button>
          <button
            type="button"
            onClick={() => handleSave('draft')}
            disabled={isSubmitting}
            className="flex-1 sm:flex-none sm:min-w-[160px] flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#171C2B] hover:bg-[#272B3A] border border-[#272B3A] hover:border-[#8B5CF6]/40 text-[#A1A1AA] hover:text-[#F8FAFC] text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving…' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* ══ ADVANCED SETTINGS ════════════════════════════════════════════════ */}
      <div className="bg-[#111522] border border-[#272B3A] rounded-2xl overflow-hidden">
        {/* Accordion toggle */}
        <button
          type="button"
          onClick={() => setAdvancedOpen((o) => !o)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#171C2B] transition-colors"
        >
          <span className="text-sm font-bold text-[#F8FAFC]">Advanced Settings</span>
          {advancedOpen ? (
            <ChevronUp className="w-4 h-4 text-[#A1A1AA]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#A1A1AA]" />
          )}
        </button>

        {advancedOpen && (
          <div className="border-t border-[#272B3A]">
            {/* ── Slug ── */}
            <div className="px-6 pt-5 pb-4 border-b border-[#272B3A]/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => { setSlug(generateSlug(title)); setSlugManuallyEdited(false); }}
                  className="text-[11px] text-[#38BDF8] hover:text-[#8B5CF6] transition-colors"
                >
                  Regenerate from title
                </button>
              </div>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-[#171C2B] border border-r-0 border-[#272B3A] rounded-l-xl text-xs text-[#A1A1AA] font-mono shrink-0">
                  /articles/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => { setSlug(generateSlug(e.target.value)); setSlugManuallyEdited(true); }}
                  placeholder="article-url-slug"
                  className="w-full px-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-r-xl text-xs font-mono text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            {/* ── Excerpt ── */}
            <div className="px-6 py-4 border-b border-[#272B3A]/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Article Excerpt
                </label>
                {excerptManuallyEdited && (
                  <button
                    type="button"
                    onClick={() => { setExcerpt(autoExcerpt(content)); setExcerptManuallyEdited(false); }}
                    className="text-[11px] text-[#38BDF8] hover:text-[#8B5CF6] transition-colors"
                  >
                    Auto-generate
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={excerpt}
                onChange={(e) => { setExcerpt(e.target.value); setExcerptManuallyEdited(true); }}
                placeholder="Brief summary shown on cards and search results…"
                className="w-full px-4 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            {/* ── Image Alt Text ── */}
            <div className="px-6 py-4 border-b border-[#272B3A]/60 space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                Image Alt Text
              </label>
              <input
                type="text"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                placeholder="Descriptive text for screen readers and SEO…"
                className="w-full px-4 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            {/* ── Tags ── */}
            <div className="px-6 py-4 border-b border-[#272B3A]/60 space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                Tags
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="Add tag, press Enter…"
                  className="flex-1 px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-2 bg-[#171C2B] border border-[#272B3A] rounded-xl text-xs font-semibold text-[#F8FAFC] hover:border-[#8B5CF6] transition-colors"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#171C2B] text-xs font-medium text-[#A1A1AA] border border-[#272B3A]"
                    >
                      <TagIcon className="w-3 h-3 text-[#8B5CF6]" />
                      {tag}
                      <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── Publication status + Scheduled date ── */}
            <div className="px-6 py-4 border-b border-[#272B3A]/60 space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                Scheduled Publishing
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'draft' | 'published' | 'scheduled')}
                className="w-full px-4 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm font-semibold text-[#F8FAFC] focus:outline-none focus:border-[#8B5CF6] cursor-pointer"
              >
                <option value="draft">Draft (private)</option>
                <option value="published">Published (live now)</option>
                <option value="scheduled">Scheduled (timed release)</option>
              </select>
              {status === 'scheduled' && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-[#090B12] border border-[#272B3A]">
                  <Clock className="w-4 h-4 text-[#38BDF8] shrink-0" />
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="flex-1 bg-transparent text-xs text-[#F8FAFC] focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* ── Featured toggle ── */}
            <div className="px-6 py-4 border-b border-[#272B3A]/60">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-[#272B3A] bg-[#090B12] text-[#8B5CF6] focus:ring-0 cursor-pointer"
                />
                <span className="text-sm font-medium text-[#F8FAFC]">Featured Story</span>
                <span className="text-xs text-[#A1A1AA]">(shown on homepage hero)</span>
              </label>
            </div>

            {/* ── Author byline (advanced) ── */}
            <div className="px-6 py-4 border-b border-[#272B3A]/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="Author name"
                  className="w-full px-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                  Author Role / Title
                </label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g. Senior Editor"
                  className="w-full px-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            {/* ── SEO / Links / Checklist tabs ── */}
            <div>
              {/* Tab bar */}
              <div className="flex border-b border-[#272B3A]">
                {([
                  { id: 'seo', label: 'SEO & Preview' },
                  { id: 'links', label: 'Internal Links' },
                  { id: 'checklist', label: 'Editorial Review' },
                ] as const).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setAdvancedTab(tab.id)}
                    className={`px-4 py-3 text-xs font-semibold transition-all border-b-2 ${
                      advancedTab === tab.id
                        ? 'border-[#8B5CF6] text-[#F8FAFC]'
                        : 'border-transparent text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#090B12]/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-6">
                {/* SEO tab */}
                {advancedTab === 'seo' && (
                  <div className="space-y-5">
                    {/* SEO Title */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                          SEO Title
                        </label>
                        <span className={`text-[10px] font-bold ${(seoTitle || title).length > 65 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {(seoTitle || title).length}/65
                        </span>
                      </div>
                      <input
                        type="text"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        placeholder={title || 'Leave blank to use article title'}
                        maxLength={70}
                        className="w-full px-4 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>

                    {/* Meta Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA]">
                          Meta Description
                        </label>
                        <span className={`text-[10px] font-bold ${(metaDescription || excerpt).length > 160 ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {(metaDescription || excerpt).length}/160
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder={excerpt || 'Leave blank to use article excerpt'}
                        maxLength={170}
                        className="w-full px-4 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-sm text-[#F8FAFC] placeholder-[#A1A1AA] focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>

                    {/* SEO Analysis */}
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

                    {/* SERP Preview */}
                    <SeoSnippetPreview
                      title={seoTitle || title}
                      slug={slug}
                      metaDescription={metaDescription || excerpt}
                    />
                  </div>
                )}

                {/* Internal Links tab */}
                {advancedTab === 'links' && (
                  <InternalLinkSuggester
                    currentSlug={slug}
                    currentCategory={category}
                    currentTags={tags}
                    content={content}
                  />
                )}

                {/* Editorial Checklist tab */}
                {advancedTab === 'checklist' && (
                  <EditorialChecklist
                    values={editorialChecklist}
                    onChange={setEditorialChecklist}
                  />
                )}
              </div>
            </div>
          </div>
        )}
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
