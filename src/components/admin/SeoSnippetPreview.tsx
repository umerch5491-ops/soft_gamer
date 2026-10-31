'use client';

import { useState } from 'react';
import { Globe, Monitor, Smartphone } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface SeoSnippetPreviewProps {
  title: string;
  slug: string;
  metaDescription: string;
}

export function SeoSnippetPreview({ title, slug, metaDescription }: SeoSnippetPreviewProps) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

  const displayTitle = title.trim() || 'Article Title Placeholder — Soft Gamer';
  const displaySlug = slug.trim() || 'your-article-slug';
  const displayDesc = metaDescription.trim() || 'Article excerpt and concise meta summary will appear here in search engine query results.';
  const canonicalUrl = `${SITE_CONFIG.url}/articles/${displaySlug}`;

  // Length guidelines
  const titleLen = title.length;
  const descLen = metaDescription.length;

  return (
    <div className="bg-[#111522] border border-[#272B3A] rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-[#272B3A]">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#F8FAFC]">
          <Globe className="w-4 h-4 text-[#38BDF8]" />
          <span>Search Engine Result Preview (SERP)</span>
        </div>

        <div className="flex items-center gap-1 bg-[#171C2B] p-1 rounded-lg border border-[#272B3A]">
          <button
            type="button"
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded text-xs transition-colors ${
              device === 'desktop' ? 'bg-[#8B5CF6] text-white' : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
            title="Desktop view"
          >
            <Monitor className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded text-xs transition-colors ${
              device === 'mobile' ? 'bg-[#8B5CF6] text-white' : 'text-[#A1A1AA] hover:text-[#F8FAFC]'
            }`}
            title="Mobile view"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Google Preview Snippet Box */}
      <div
        className={`p-4 rounded-xl border border-[#272B3A] bg-[#090B12] transition-all font-sans ${
          device === 'mobile' ? 'max-w-sm mx-auto' : 'w-full'
        }`}
      >
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-linear-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center text-[8px] font-black text-white">
            SG
          </div>
          <div className="flex flex-col">
            <span className="text-[12px] text-[#A1A1AA] leading-none">Soft Gamer</span>
            <span className="text-[11px] text-[#38BDF8] truncate max-w-[280px]">
              {canonicalUrl}
            </span>
          </div>
        </div>

        <h4 className="text-base sm:text-lg font-semibold text-[#8B5CF6] hover:underline line-clamp-1 cursor-pointer">
          {displayTitle} | Soft Gamer
        </h4>

        <p className="text-xs sm:text-sm text-[#A1A1AA] line-clamp-2 mt-1 leading-snug">
          {displayDesc}
        </p>
      </div>

      {/* Counters & Guidelines */}
      <div className="grid grid-cols-2 gap-4 text-xs pt-2">
        <div className="p-2.5 rounded-lg bg-[#171C2B] border border-[#272B3A] flex items-center justify-between">
          <span className="text-[#A1A1AA]">Title Length:</span>
          <span className={`font-mono font-semibold ${
            titleLen >= 50 && titleLen <= 60
              ? 'text-emerald-400'
              : titleLen > 60
              ? 'text-amber-400'
              : 'text-[#F8FAFC]'
          }`}>
            {titleLen}/60 chars
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-[#171C2B] border border-[#272B3A] flex items-center justify-between">
          <span className="text-[#A1A1AA]">Meta Description:</span>
          <span className={`font-mono font-semibold ${
            descLen >= 120 && descLen <= 160
              ? 'text-emerald-400'
              : descLen > 160
              ? 'text-amber-400'
              : 'text-[#F8FAFC]'
          }`}>
            {descLen}/160 chars
          </span>
        </div>
      </div>
    </div>
  );
}

