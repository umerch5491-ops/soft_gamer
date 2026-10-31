'use client';

import React, { useMemo } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  BarChart2,
} from 'lucide-react';

interface SeoAnalysisProps {
  title: string;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  slug: string;
  content: string;
  featuredImage: string;
  imageAlt: string;
  category: string;
  authorName: string;
}

type CheckStatus = 'good' | 'improvement' | 'missing';

interface SeoCheck {
  id: string;
  label: string;
  status: CheckStatus;
  message: string;
  recommendation: string;
  category: 'metadata' | 'content' | 'links' | 'media';
}

export function SeoAnalysisPanel({
  title,
  seoTitle,
  metaDescription,
  excerpt,
  slug,
  content,
  featuredImage,
  imageAlt,
  category,
  authorName,
}: SeoAnalysisProps) {
  // Real-time analysis calculations
  const analysis = useMemo(() => {
    const checks: SeoCheck[] = [];

    // 1. Article Title Check
    const titleLen = title.trim().length;
    if (titleLen === 0) {
      checks.push({
        id: 'title',
        label: 'Headline Title',
        status: 'missing',
        message: 'Headline is missing',
        recommendation: 'Enter an engaging, descriptive headline (recommended: 40-75 characters).',
        category: 'metadata',
      });
    } else if (titleLen < 30) {
      checks.push({
        id: 'title',
        label: 'Headline Title',
        status: 'improvement',
        message: `Headline is short (${titleLen} chars)`,
        recommendation: 'Consider expanding to at least 30 characters for better search engine context.',
        category: 'metadata',
      });
    } else if (titleLen > 85) {
      checks.push({
        id: 'title',
        label: 'Headline Title',
        status: 'improvement',
        message: `Headline is long (${titleLen} chars)`,
        recommendation: 'Search results typically truncate titles after 70-80 characters.',
        category: 'metadata',
      });
    } else {
      checks.push({
        id: 'title',
        label: 'Headline Title',
        status: 'good',
        message: `Optimal headline length (${titleLen} chars)`,
        recommendation: 'Well-proportioned for Google SERP display.',
        category: 'metadata',
      });
    }

    // 2. SEO Title Tag Override
    const activeSeoTitle = seoTitle.trim() || title.trim();
    const seoTitleLen = activeSeoTitle.length;
    if (seoTitleLen > 65) {
      checks.push({
        id: 'seo_title',
        label: 'Search Engine Title Tag',
        status: 'improvement',
        message: `SEO Title is ${seoTitleLen} chars (Google limit: ~60-65)`,
        recommendation: 'Shorten SEO Title tag to prevent ellipsis cut-off in SERP.',
        category: 'metadata',
      });
    } else if (seoTitleLen > 0) {
      checks.push({
        id: 'seo_title',
        label: 'Search Engine Title Tag',
        status: 'good',
        message: `SERP Title tag within bounds (${seoTitleLen} chars)`,
        recommendation: 'Will render cleanly in Google desktop and mobile cards.',
        category: 'metadata',
      });
    } else {
      checks.push({
        id: 'seo_title',
        label: 'Search Engine Title Tag',
        status: 'missing',
        message: 'No title available for search indexing',
        recommendation: 'Set an article title or custom SEO title.',
        category: 'metadata',
      });
    }

    // 3. Meta Description Check
    const activeMeta = metaDescription.trim() || excerpt.trim();
    const metaLen = activeMeta.length;
    if (metaLen === 0) {
      checks.push({
        id: 'meta_description',
        label: 'Meta Description',
        status: 'missing',
        message: 'No meta description or excerpt provided',
        recommendation: 'Add a 120-160 character snippet summarizing key takeaways.',
        category: 'metadata',
      });
    } else if (metaLen < 100) {
      checks.push({
        id: 'meta_description',
        label: 'Meta Description',
        status: 'improvement',
        message: `Snippet is brief (${metaLen} chars)`,
        recommendation: 'Aim for 120-160 characters to maximize SERP click-through rate.',
        category: 'metadata',
      });
    } else if (metaLen > 165) {
      checks.push({
        id: 'meta_description',
        label: 'Meta Description',
        status: 'improvement',
        message: `Snippet exceeds target (${metaLen} chars)`,
        recommendation: 'Google usually truncates descriptions beyond ~160 characters.',
        category: 'metadata',
      });
    } else {
      checks.push({
        id: 'meta_description',
        label: 'Meta Description',
        status: 'good',
        message: `Optimal snippet length (${metaLen} chars)`,
        recommendation: 'Strong candidate for rich Google search snippet presentation.',
        category: 'metadata',
      });
    }

    // 4. URL Slug Kebab-case
    const cleanSlug = slug.trim();
    const isKebab = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(cleanSlug);
    if (!cleanSlug) {
      checks.push({
        id: 'slug',
        label: 'URL Slug Structure',
        status: 'missing',
        message: 'URL slug is empty',
        recommendation: 'Generate a lowercase, hyphenated permalink.',
        category: 'metadata',
      });
    } else if (!isKebab || cleanSlug.length > 75) {
      checks.push({
        id: 'slug',
        label: 'URL Slug Structure',
        status: 'improvement',
        message: 'Slug has special chars or exceeds 75 characters',
        recommendation: 'Keep slugs clean, concise, and alphanumeric with hyphens.',
        category: 'metadata',
      });
    } else {
      checks.push({
        id: 'slug',
        label: 'URL Slug Structure',
        status: 'good',
        message: 'Clean search-friendly canonical slug',
        recommendation: 'Follows Google URL structure best practices.',
        category: 'metadata',
      });
    }

    // 5. Word Count & Content Depth
    const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const wordCount = plainText ? plainText.split(/\s+/).length : 0;
    if (wordCount < 200) {
      checks.push({
        id: 'word_count',
        label: 'Editorial Word Count',
        status: 'improvement',
        message: `Short coverage (${wordCount} words)`,
        recommendation: 'Comprehensive gaming guides and news typically benefit from 350+ words of analysis.',
        category: 'content',
      });
    } else {
      checks.push({
        id: 'word_count',
        label: 'Editorial Word Count',
        status: 'good',
        message: `Substantive depth (${wordCount} words)`,
        recommendation: 'Adequate length for comprehensive topical coverage.',
        category: 'content',
      });
    }

    // 6. Heading Structure (H1 check and H2 count)
    const hasH1InBody = /<h1[\s>]/i.test(content);
    const h2Matches = content.match(/<h2[\s>]/gi) || [];
    const h3Matches = content.match(/<h3[\s>]/gi) || [];
    if (hasH1InBody) {
      checks.push({
        id: 'heading_hierarchy',
        label: 'Heading Hierarchy',
        status: 'improvement',
        message: 'H1 detected inside article content body',
        recommendation: 'Page templates reserve H1 for the main title. Use H2 and H3 subheadings inside the article body.',
        category: 'content',
      });
    } else if (wordCount > 350 && h2Matches.length === 0) {
      checks.push({
        id: 'heading_hierarchy',
        label: 'Heading Hierarchy',
        status: 'improvement',
        message: 'No H2 subheadings found in long-form text',
        recommendation: 'Break up reader scan flow using H2 headings every 200-300 words.',
        category: 'content',
      });
    } else {
      checks.push({
        id: 'heading_hierarchy',
        label: 'Heading Hierarchy',
        status: 'good',
        message: `Semantic headings intact (${h2Matches.length} H2s, ${h3Matches.length} H3s)`,
        recommendation: 'Clean hierarchy aids reader scannability and assistive screen readers.',
        category: 'content',
      });
    }

    // 7. Featured Image & Alt Text
    const hasImage = Boolean(featuredImage && !featuredImage.includes('placeholder'));
    const altLen = imageAlt.trim().length;
    if (!hasImage) {
      checks.push({
        id: 'featured_image',
        label: 'Featured Image',
        status: 'improvement',
        message: 'Using default or missing featured graphic',
        recommendation: 'Select a high-resolution 16:9 featured screenshot or graphic.',
        category: 'media',
      });
    } else if (altLen < 8) {
      checks.push({
        id: 'featured_image',
        label: 'Featured Image Alt Text',
        status: 'improvement',
        message: 'Featured image alt text is missing or too brief',
        recommendation: 'Describe image context for Google Image Search and accessibility.',
        category: 'media',
      });
    } else {
      checks.push({
        id: 'featured_image',
        label: 'Featured Media & Alt Text',
        status: 'good',
        message: 'Featured image and descriptive alt text verified',
        recommendation: 'Eligible for Google Discover and Google Images rich indexing.',
        category: 'media',
      });
    }

    // 8. Internal Links Detection
    const internalLinkMatches = content.match(/href=["'](\/|https?:\/\/(?:localhost|softgamer\.dev))/gi) || [];
    if (internalLinkMatches.length === 0) {
      checks.push({
        id: 'internal_links',
        label: 'Internal Linking',
        status: 'improvement',
        message: 'No internal links detected in article body',
        recommendation: 'Link to related category hubs or previous Soft Gamer articles to pass link equity.',
        category: 'links',
      });
    } else {
      checks.push({
        id: 'internal_links',
        label: 'Internal Linking',
        status: 'good',
        message: `${internalLinkMatches.length} internal reference link(s) found`,
        recommendation: 'Aids crawler topic clustering and reader session duration.',
        category: 'links',
      });
    }

    // 9. Malformed / Empty Link Detection
    const malformedLinks = content.match(/href=["'](?:#|undefined|null|javascript:void\(0\)|)?["']/gi) || [];
    if (malformedLinks.length > 0) {
      checks.push({
        id: 'link_quality',
        label: 'Link Syntax Health',
        status: 'improvement',
        message: `${malformedLinks.length} empty or broken link attribute(s) found`,
        recommendation: 'Ensure all hyperlinks contain valid, working absolute or relative URLs.',
        category: 'links',
      });
    } else {
      checks.push({
        id: 'link_quality',
        label: 'Link Syntax Health',
        status: 'good',
        message: 'Zero malformed or dead href attributes detected',
        recommendation: 'Clean anchor hygiene verified.',
        category: 'links',
      });
    }

    // 10. Taxonomy & Authorship
    if (!category || !authorName.trim()) {
      checks.push({
        id: 'attribution',
        label: 'Publisher & Author Attribution',
        status: 'improvement',
        message: 'Author or Category assignment missing',
        recommendation: 'E-E-A-T guidelines emphasize genuine author attribution and editorial vertical.',
        category: 'metadata',
      });
    } else {
      checks.push({
        id: 'attribution',
        label: 'Author & Vertical Attribution',
        status: 'good',
        message: `Assigned to ${authorName} in ${category}`,
        recommendation: 'Meets Google News and E-E-A-T author transparency criteria.',
        category: 'metadata',
      });
    }

    const goodCount = checks.filter((c) => c.status === 'good').length;
    const improvementCount = checks.filter((c) => c.status === 'improvement').length;
    const missingCount = checks.filter((c) => c.status === 'missing').length;

    return {
      checks,
      goodCount,
      improvementCount,
      missingCount,
      total: checks.length,
    };
  }, [title, seoTitle, metaDescription, excerpt, slug, content, featuredImage, imageAlt, category, authorName]);

  const statusIcons = {
    good: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    improvement: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    missing: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
  };

  const statusBadges = {
    good: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    improvement: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    missing: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4">
      {/* Header with KPI status score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#272B3A]">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#8B5CF6]" />
            <h3 className="text-base font-bold text-[#F8FAFC]">
              Real-Time Search Engine Analysis
            </h3>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Evaluates technical crawlability, headline bounds, semantic headings, and E-E-A-T indicators.
          </p>
        </div>

        {/* Readiness pill */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#171C2B] border border-[#272B3A] text-[#F8FAFC]">
            {analysis.goodCount} / {analysis.total} Checks Passed
          </span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              analysis.missingCount > 0
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : analysis.improvementCount > 2
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {analysis.missingCount > 0
              ? 'Action Required'
              : analysis.improvementCount > 2
              ? 'Moderate Readiness'
              : 'High Search Readiness'}
          </span>
        </div>
      </div>

      {/* Diagnostics Grid */}
      <div className="space-y-2.5">
        {analysis.checks.map((check) => (
          <div
            key={check.id}
            className="p-3 rounded-xl bg-[#090B12] border border-[#272B3A] flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{statusIcons[check.status]}</div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F8FAFC]">{check.label}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                      statusBadges[check.status]
                    }`}
                  >
                    {check.status === 'good'
                      ? 'Good'
                      : check.status === 'improvement'
                      ? 'Needs Improvement'
                      : 'Missing'}
                  </span>
                </div>
                <p className="text-xs text-[#E2E8F0]">{check.message}</p>
                <p className="text-[11px] text-[#A1A1AA] flex items-center gap-1">
                  <HelpCircle className="w-3 h-3 text-[#38BDF8] shrink-0" />
                  <span>{check.recommendation}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sensible SEO advice banner */}
      <div className="p-3 rounded-xl bg-[#171C2B] border border-[#272B3A] text-[11px] text-[#A1A1AA] leading-relaxed">
        <span className="text-[#38BDF8] font-bold">Editorial Note:</span> These metrics provide guidance
        for search crawlability and snippet presentation. Rankings depend on originality, reader utility, and topical authority rather than mechanical formula checklists.
      </div>
    </div>
  );
}

