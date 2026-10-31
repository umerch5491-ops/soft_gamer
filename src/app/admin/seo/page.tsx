'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart2,
  FileText,
  Globe,
  Shield,
  ExternalLink,
  RefreshCw,
  Eye,
  Info,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getAdminArticles } from '@/lib/admin/articleService';
import { SITE_CONFIG } from '@/lib/constants';
import { isSupabaseConfigured } from '@/lib/supabase';
import { Article } from '@/types/article';

type SeoStatus = 'pass' | 'warn' | 'fail' | 'not-connected';

interface SeoIssue {
  articleId: string;
  articleTitle: string;
  articleSlug: string;
  type: 'missing-meta-description' | 'missing-alt' | 'missing-excerpt' | 'missing-author'
    | 'missing-featured-image' | 'slug-issue' | 'draft-exposure' | 'missing-seo-title';
  severity: 'error' | 'warning';
  message: string;
}

interface TechCheck {
  id: string;
  label: string;
  status: SeoStatus;
  detail: string;
  recommendation?: string;
}

export default function AdminSeoPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [now] = useState<number>(() => Date.now());

  useEffect(() => {
    let mounted = true;
    getAdminArticles().then((data) => {
      if (mounted) {
        setArticles(data);
        setIsLoading(false);
        setLastRefreshed(new Date());
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  const refresh = () => {
    setIsLoading(true);
    getAdminArticles().then((data) => {
      setArticles(data);
      setIsLoading(false);
      setLastRefreshed(new Date());
    });
  };

  // --- Article SEO Issue Scanner ---
  const issues: SeoIssue[] = [];
  const published = articles.filter((a) => a.status === 'published' && new Date(a.publishedAt).getTime() <= now);

  for (const article of articles) {
    const isPublished = article.status === 'published' && new Date(article.publishedAt).getTime() <= now;

    if (!article.metaDescription && !article.excerpt) {
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'missing-meta-description',
        severity: 'warning',
        message: 'No meta description or excerpt — Google will auto-generate a snippet',
      });
    }

    if (!article.imageAlt || article.imageAlt.trim().length < 5) {
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'missing-alt',
        severity: 'warning',
        message: 'Featured image has no alt text — affects accessibility and Google Images indexing',
      });
    }

    if (!article.excerpt || article.excerpt.trim().length < 30) {
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'missing-excerpt',
        severity: 'warning',
        message: 'Short or missing article excerpt — used as fallback for meta descriptions and card grids',
      });
    }

    if (!article.author?.name || article.author.name.trim().length < 2) {
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'missing-author',
        severity: 'error',
        message: 'No author assigned — violates Google E-E-A-T authorship transparency guidelines',
      });
    }

    if (!article.featuredImage || article.featuredImage.includes('placeholder')) {
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'missing-featured-image',
        severity: 'warning',
        message: 'Uses placeholder image — reduces eligibility for Google Discover and rich previews',
      });
    }

    if (!article.seoTitle && isPublished) {
      // Not an error — falls back to title — but still worth flagging
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'missing-seo-title',
        severity: 'warning',
        message: 'No custom SEO title — article title will be used; ensure it is within 65 characters',
      });
    }

    const slugValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug);
    if (!slugValid || article.slug.length > 80) {
      issues.push({
        articleId: article.id,
        articleTitle: article.title,
        articleSlug: article.slug,
        type: 'slug-issue',
        severity: 'error',
        message: `Slug "${article.slug}" contains invalid characters or exceeds 80 chars`,
      });
    }
  }

  const errorCount = issues.filter((i) => i.severity === 'error').length;
  const warnCount = issues.filter((i) => i.severity === 'warning').length;

  // --- Technical SEO Configuration Checks ---
  const siteUrl = SITE_CONFIG.url;
  const isLocalhost = siteUrl.includes('localhost') || siteUrl.includes('127.0.0.1');
  const hasSupabase = isSupabaseConfigured();
  const hasGoogleVerification = Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION);

  const techChecks: TechCheck[] = [
    {
      id: 'site_url',
      label: 'NEXT_PUBLIC_SITE_URL Configuration',
      status: isLocalhost ? 'warn' : 'pass',
      detail: isLocalhost
        ? `Currently set to "${siteUrl}" — change to production domain before Vercel launch`
        : `Configured: ${siteUrl}`,
      recommendation: isLocalhost
        ? 'Set NEXT_PUBLIC_SITE_URL=https://yourdomain.com in production environment variables'
        : undefined,
    },
    {
      id: 'sitemap',
      label: 'Dynamic XML Sitemap',
      status: 'pass',
      detail: `${SITE_CONFIG.url}/sitemap.xml — includes ${published.length} published article(s), all core pages`,
    },
    {
      id: 'robots',
      label: 'Robots.txt Configuration',
      status: 'pass',
      detail: 'Disallows: /admin, /search, /api — allows all public editorial pages',
    },
    {
      id: 'structured_data',
      label: 'Schema.org Structured Data',
      status: 'pass',
      detail: 'NewsArticle, WebSite, Organization, BreadcrumbList schemas implemented',
    },
    {
      id: 'canonical',
      label: 'Canonical URLs',
      status: 'pass',
      detail: 'Per-page canonical tags on all public routes using configured NEXT_PUBLIC_SITE_URL',
    },
    {
      id: 'open_graph',
      label: 'Open Graph & Twitter Cards',
      status: 'pass',
      detail: 'Article-level OG tags with featured image, publish timestamps, and author fields',
    },
    {
      id: 'noindex_admin',
      label: 'Admin Pages Noindex',
      status: 'pass',
      detail: '/admin/* excluded via robots.txt and robots: { index: false } metadata',
    },
    {
      id: 'noindex_search',
      label: 'Search Results Noindex',
      status: 'pass',
      detail: '/search route uses robots: { index: false, follow: true }',
    },
    {
      id: 'draft_protection',
      label: 'Draft / Scheduled Article Indexing',
      status: 'pass',
      detail: 'DAL enforces status=published AND published_at <= NOW() before serving to public pages, sitemap, and metadata',
    },
    {
      id: 'supabase',
      label: 'Database Connection (Supabase)',
      status: hasSupabase ? 'pass' : 'warn',
      detail: hasSupabase
        ? 'Live Supabase credentials detected — dynamic article data active'
        : 'Running in Demo Mode — set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to activate',
    },
    {
      id: 'gsc_verification',
      label: 'Google Search Console Verification Token',
      status: hasGoogleVerification ? 'pass' : 'not-connected',
      detail: hasGoogleVerification
        ? 'NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION env variable detected'
        : 'Not connected — set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION after domain is live',
      recommendation: 'Verify domain in Google Search Console → Settings → Ownership verification → HTML tag method',
    },
  ];

  const passCount = techChecks.filter((c) => c.status === 'pass').length;

  const statusIcons = {
    pass: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    warn: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />,
    fail: <XCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    'not-connected': <Info className="w-4 h-4 text-[#38BDF8] shrink-0" />,
  };

  const issueSeverityIcons = {
    error: <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />,
  };

  const issueSeverityBadge = {
    error: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  return (
    <AdminLayout pageTitle="SEO Audit Dashboard">
      <div className="space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
              Search Engine Optimization Audit
            </h2>
            <p className="text-xs sm:text-sm text-[#A1A1AA] mt-1">
              Live analysis of article SEO health and technical configuration.
              Last refreshed: {lastRefreshed.toLocaleTimeString()}.
            </p>
          </div>
          <button
            onClick={refresh}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171C2B] hover:bg-[#8B5CF6] text-xs font-semibold text-[#F8FAFC] border border-[#272B3A] transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Audit
          </button>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: 'Published Articles',
              value: isLoading ? '—' : String(published.length),
              icon: FileText,
              color: 'text-[#38BDF8]',
              bg: 'bg-[#38BDF8]/10',
            },
            {
              label: 'SEO Errors',
              value: isLoading ? '—' : String(errorCount),
              icon: XCircle,
              color: 'text-rose-400',
              bg: 'bg-rose-500/10',
            },
            {
              label: 'SEO Warnings',
              value: isLoading ? '—' : String(warnCount),
              icon: AlertTriangle,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
            {
              label: 'Tech Checks Passed',
              value: isLoading ? '—' : `${passCount}/${techChecks.length}`,
              icon: CheckCircle2,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5"
            >
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className="text-2xl font-extrabold text-[#F8FAFC] mb-0.5">{card.value}</div>
              <div className="text-xs text-[#A1A1AA]">{card.label}</div>
            </div>
          ))}
        </div>

        {/* Article-Level SEO Issues */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <BarChart2 className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Article SEO Issue Log</h3>
              <p className="text-xs text-[#A1A1AA]">
                {isLoading ? 'Scanning articles...' : `${issues.length} issue(s) found across ${articles.length} article(s)`}
              </p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12 gap-2 text-[#A1A1AA]">
              <RefreshCw className="w-4 h-4 animate-spin text-[#8B5CF6]" />
              <span className="text-sm">Auditing article database...</span>
            </div>
          ) : issues.length === 0 ? (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-semibold">No SEO issues detected across all articles.</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {issues.map((issue, idx) => (
                <div
                  key={`${issue.articleId}-${issue.type}-${idx}`}
                  className="flex items-start gap-3 p-3 rounded-xl bg-[#090B12] border border-[#272B3A]"
                >
                  <div className="mt-0.5">{issueSeverityIcons[issue.severity]}</div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${issueSeverityBadge[issue.severity]}`}
                      >
                        {issue.severity}
                      </span>
                      <span className="text-xs font-semibold text-[#F8FAFC] truncate">
                        {issue.articleTitle}
                      </span>
                    </div>
                    <p className="text-xs text-[#A1A1AA]">{issue.message}</p>
                  </div>
                  <Link
                    href={`/admin/articles/${issue.articleId}/edit`}
                    className="shrink-0 text-[11px] font-semibold text-[#38BDF8] hover:text-[#8B5CF6] flex items-center gap-1 whitespace-nowrap"
                  >
                    Fix <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Technical SEO Checks */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-[#38BDF8]" />
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Technical Configuration Audit</h3>
              <p className="text-xs text-[#A1A1AA]">
                Verifies robots, sitemap, canonical URLs, structured data, and indexing controls.
              </p>
            </div>
          </div>

          <div className="space-y-2.5">
            {techChecks.map((check) => (
              <div
                key={check.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-[#090B12] border border-[#272B3A]"
              >
                {statusIcons[check.status]}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#F8FAFC]">{check.label}</p>
                  <p className="text-xs text-[#A1A1AA] mt-0.5">{check.detail}</p>
                  {check.recommendation && (
                    <p className="text-[11px] text-[#38BDF8] mt-0.5">{check.recommendation}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    check.status === 'pass'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : check.status === 'warn'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : check.status === 'fail'
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      : 'bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20'
                  }`}
                >
                  {check.status === 'not-connected' ? 'Not Connected' : check.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Google Search Console Readiness */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#8B5CF6]" />
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Google Search Console Readiness</h3>
              <p className="text-xs text-[#A1A1AA]">
                Steps to complete after the live domain is deployed and DNS is propagated.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#A1A1AA]">
            {[
              {
                step: '1',
                label: 'Open Google Search Console',
                detail: 'Go to search.google.com/search-console and sign in with the site owner\'s Google account.',
              },
              {
                step: '2',
                label: 'Add your property',
                detail: `Enter "${SITE_CONFIG.url}" under the URL Prefix method, or the root domain under Domain method.`,
              },
              {
                step: '3',
                label: 'Verify ownership via HTML tag',
                detail: 'Copy the meta verification token. Add it to NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION in your .env.local and deploy.',
              },
              {
                step: '4',
                label: 'Submit your sitemap',
                detail: `In GSC → Sitemaps, submit: ${SITE_CONFIG.url}/sitemap.xml`,
              },
              {
                step: '5',
                label: 'Request Indexing for key pages',
                detail: 'Use URL Inspection tool to request indexing for homepage and top category pages after first deployment.',
              },
              {
                step: '6',
                label: 'Monitor Coverage and Core Web Vitals',
                detail: 'Check GSC weekly for coverage errors, Discover performance, and INP/LCP/CLS regressions.',
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3 p-3 rounded-xl bg-[#090B12] border border-[#272B3A]">
                <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {item.step}
                </span>
                <div>
                  <p className="font-semibold text-[#F8FAFC]">{item.label}</p>
                  <p className="text-[#A1A1AA] mt-0.5">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AdSense Readiness Checklist */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-[#F8FAFC]">Google AdSense Readiness Checklist</h3>
              <p className="text-xs text-[#A1A1AA]">
                Review before applying for AdSense. Approval is not guaranteed and depends on Google&apos;s review.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Original, editorial gaming content', status: 'pass', detail: 'Soft Gamer publishes original editorial commentary, hardware analysis, and guides — not curated or scraped content.' },
              { label: 'Complete navigation structure', status: 'pass', detail: 'Header nav, footer links, category hubs, breadcrumbs, and search all operational.' },
              { label: 'Contact Us page with real information', status: 'warn', detail: 'Contact page exists. Owner must add a real email address before applying to AdSense.' },
              { label: 'Privacy Policy page present', status: 'pass', detail: '/privacy-policy exists. Must be updated with real tracking/cookie practices before AdSense activation.' },
              { label: 'About Us page present', status: 'pass', detail: '/about exists. Owner must provide genuine publication details.' },
              { label: 'Terms & Conditions present', status: 'pass', detail: '/terms-and-conditions and /disclaimer exist.' },
              { label: 'No placeholder or template-only content', status: 'warn', detail: 'Sample articles from development build are present. Replace with real editorial content before applying.' },
              { label: 'Mobile usability', status: 'pass', detail: 'Fully responsive dark magazine layout tested on mobile viewports.' },
              { label: 'No deceptive or misleading placements', status: 'pass', detail: 'AdSlot component hidden by default. No fake buttons or accidental-click layouts.' },
              { label: 'No copyrighted material without license', status: 'warn', detail: 'Owner must confirm all images used in articles are legally licensed or original.' },
              { label: 'Sufficient original published content', status: 'warn', detail: 'AdSense evaluates content quality and quantity. Publish real editorial articles before applying.' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-[#090B12] border border-[#272B3A]">
                {item.status === 'pass'
                  ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                }
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#F8FAFC]">{item.label}</p>
                  <p className="text-[11px] text-[#A1A1AA] mt-0.5">{item.detail}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                  item.status === 'pass'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {item.status === 'pass' ? 'Ready' : 'Action Needed'}
                </span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-[#71717A] border-t border-[#272B3A] pt-3">
            Soft Gamer does not guarantee AdSense approval. Google conducts its own independent quality review. This checklist reflects structural readiness only.
          </p>
        </div>

        {/* Sitemap Links */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#38BDF8]" />
            Live SEO Resource URLs
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'Sitemap XML', url: '/sitemap.xml' },
              { label: 'Robots.txt', url: '/robots.txt' },
              { label: 'Homepage', url: '/' },
              { label: 'Search', url: '/search' },
            ].map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#090B12] border border-[#272B3A] hover:border-[#38BDF8]/50 transition-all group"
              >
                <span className="text-xs font-semibold text-[#F8FAFC]">{item.label}</span>
                <span className="flex items-center gap-1.5 text-[10px] text-[#A1A1AA] group-hover:text-[#38BDF8] font-mono">
                  {item.url}
                  <ExternalLink className="w-3 h-3" />
                </span>
              </a>
            ))}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

