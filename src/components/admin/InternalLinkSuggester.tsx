'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Link2, Copy, Check, Loader2, ExternalLink } from 'lucide-react';
import { Article } from '@/types/article';
import { getAdminArticles } from '@/lib/admin/articleService';

interface InternalLinkSuggesterProps {
  currentSlug: string;
  currentCategory: string;
  currentTags: string[];
  content: string;
}

export function InternalLinkSuggester({
  currentSlug,
  currentCategory,
  currentTags,
  content,
}: InternalLinkSuggesterProps) {
  const [allArticles, setAllArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [now] = useState<number>(() => Date.now());

  useEffect(() => {
    let mounted = true;
    getAdminArticles().then((data) => {
      if (mounted) {
        setAllArticles(data);
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const suggestions = useMemo(() => {
    // Only suggest published, non-future articles — never drafts or scheduled
    const eligible = allArticles.filter(
      (a) =>
        a.slug !== currentSlug && // no self-link
        a.status === 'published' &&
        new Date(a.publishedAt).getTime() <= now
    );

    // Score each candidate by relevance
    const scored = eligible.map((article) => {
      let score = 0;

      // Strong signal: same category
      if (article.category === currentCategory) score += 4;

      // Tag overlap
      const tagOverlap = (article.tags || []).filter((t) =>
        currentTags.map((ct) => ct.toLowerCase()).includes(t.toLowerCase())
      ).length;
      score += tagOverlap * 2;

      // Word overlap between content and article title (basic)
      if (content.length > 50) {
        const contentWords = new Set(content.replace(/<[^>]*>/g, ' ').toLowerCase().split(/\W+/));
        const titleWords = article.title.toLowerCase().split(/\W+/);
        const titleOverlap = titleWords.filter((w) => w.length > 4 && contentWords.has(w)).length;
        score += titleOverlap;
      }

      // Penalise if already linked in content
      const isAlreadyLinked = content.includes(`/articles/${article.slug}`);
      if (isAlreadyLinked) score -= 10;

      return { article, score, isAlreadyLinked };
    });

    return scored
      .filter((s) => s.score > 0 && !s.isAlreadyLinked)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, [allArticles, currentSlug, currentCategory, currentTags, content, now]);

  const copyMarkdownLink = (article: Article) => {
    const url = `/articles/${article.slug}`;
    const text = `[${article.title}](${url})`;
    navigator.clipboard.writeText(text);
    setCopiedSlug(article.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const copyHtmlLink = (article: Article) => {
    const url = `/articles/${article.slug}`;
    const text = `<a href="${url}">${article.title}</a>`;
    navigator.clipboard.writeText(text);
    setCopiedSlug(article.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#38BDF8]" />
          Internal Link Suggestions
        </h3>
        <p className="text-xs text-[#A1A1AA] mt-0.5">
          Related published articles in the same category or matching tags. Linking these aids reader retention and topic clustering.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-6 gap-2 text-[#A1A1AA]">
          <Loader2 className="w-4 h-4 animate-spin text-[#8B5CF6]" />
          <span className="text-xs">Scanning published archive...</span>
        </div>
      ) : suggestions.length === 0 ? (
        <div className="py-6 text-center text-xs text-[#A1A1AA] bg-[#090B12] rounded-xl border border-[#272B3A]">
          <Link2 className="w-8 h-8 text-[#272B3A] mx-auto mb-2" />
          <p className="font-semibold text-[#F8FAFC] mb-1">No Suggestions Available</p>
          <p>No related published articles found in the same category or with overlapping tags.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {suggestions.map(({ article }) => (
            <div
              key={article.slug}
              className="p-3 rounded-xl bg-[#090B12] border border-[#272B3A] space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#F8FAFC] leading-snug line-clamp-2">
                    {article.title}
                  </p>
                  <p className="text-[10px] text-[#A1A1AA] mt-0.5">
                    {article.categoryName} · {new Date(article.publishedAt).getFullYear()}
                  </p>
                </div>
                <a
                  href={`/articles/${article.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-[#A1A1AA] hover:text-[#38BDF8] transition-colors"
                  title="Preview article"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => copyHtmlLink(article)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#171C2B] hover:bg-[#8B5CF6]/20 text-[10px] font-semibold text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#272B3A] transition-all"
                >
                  {copiedSlug === article.slug ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy HTML Link
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => copyMarkdownLink(article)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#171C2B] hover:bg-[#38BDF8]/20 text-[10px] font-semibold text-[#A1A1AA] hover:text-[#F8FAFC] border border-[#272B3A] transition-all"
                >
                  <Copy className="w-3 h-3" />
                  Copy Markdown
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[10px] text-[#71717A] border-t border-[#272B3A] pt-3">
        Suggestions are ranked by category match and tag overlap. Only published, live articles are shown — drafts and scheduled posts are excluded.
      </p>
    </div>
  );
}

