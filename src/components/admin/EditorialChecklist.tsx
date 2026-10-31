'use client';

import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Square,
  Info,
} from 'lucide-react';

export const EDITORIAL_CHECKLIST_ITEMS: Array<{
  id: string;
  label: string;
  guidance: string;
  critical: boolean;
}> = [
  {
    id: 'accuracy',
    label: 'Information is accurate and verifiable',
    guidance: 'Facts, specs, dates, and product details have been independently verified.',
    critical: true,
  },
  {
    id: 'original',
    label: 'Content is original — not copied from other sources',
    guidance: 'Article represents fresh editorial perspective, not a rewrite or duplication.',
    critical: true,
  },
  {
    id: 'factual_support',
    label: 'Factual claims are supported or properly attributed',
    guidance: 'Statistics, benchmarks, and data points reference credible publishers or manufacturers.',
    critical: true,
  },
  {
    id: 'headline_match',
    label: 'Headline accurately describes the article body',
    guidance: 'The title does not exaggerate, sensationalize, or misrepresent the content.',
    critical: true,
  },
  {
    id: 'reader_value',
    label: 'Article provides genuine value for the target gaming audience',
    guidance: 'Reader walks away better informed; not just padding or thin filler content.',
    critical: false,
  },
  {
    id: 'sources_credited',
    label: 'Sources and credits are properly referenced',
    guidance: 'Developer quotes, PR statements, and third-party data are attributed.',
    critical: false,
  },
  {
    id: 'images_licensed',
    label: 'Images are legally usable and properly credited',
    guidance: 'All images are original, licensed, sourced under CC/fair use, or used with permission.',
    critical: true,
  },
  {
    id: 'dates_accurate',
    label: 'Publication and update timestamps are accurate',
    guidance: 'Do not use fabricated dates to manipulate freshness signals.',
    critical: true,
  },
  {
    id: 'author_genuine',
    label: 'Author attribution is genuine and non-fabricated',
    guidance: 'Author name represents a real editorial contributor, not an invented persona.',
    critical: true,
  },
  {
    id: 'proofread',
    label: 'Article has been proofread for grammar and clarity',
    guidance: 'Checked for typos, incomplete sentences, and factual inconsistencies.',
    critical: false,
  },
];

interface EditorialChecklistProps {
  values: Record<string, boolean>;
  onChange: (updated: Record<string, boolean>) => void;
}

export function EditorialChecklist({ values, onChange }: EditorialChecklistProps) {
  const [showGuidance, setShowGuidance] = useState(false);

  const toggleItem = (id: string) => {
    onChange({ ...values, [id]: !values[id] });
  };

  const summary = useMemo(() => {
    const total = EDITORIAL_CHECKLIST_ITEMS.length;
    const done = EDITORIAL_CHECKLIST_ITEMS.filter((item) => values[item.id]).length;
    const criticalDone = EDITORIAL_CHECKLIST_ITEMS
      .filter((item) => item.critical)
      .every((item) => values[item.id]);
    return { total, done, criticalDone };
  }, [values]);

  return (
    <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#F8FAFC] flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#8B5CF6]" />
            Editorial Quality Checklist
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Review and confirm each item before publishing. This does not automatically certify accuracy.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowGuidance(!showGuidance)}
          className="shrink-0 text-[#38BDF8] hover:text-[#8B5CF6] transition-colors"
          title="Toggle guidance notes"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-[#A1A1AA]">
            {summary.done} of {summary.total} items reviewed
          </span>
          <span className={`font-semibold ${summary.criticalDone ? 'text-emerald-400' : 'text-amber-400'}`}>
            {summary.criticalDone ? 'All critical items confirmed' : 'Critical items pending'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[#272B3A] rounded-full overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-[#8B5CF6] to-[#38BDF8] transition-all duration-300"
            style={{ width: `${(summary.done / summary.total) * 100}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-2">
        {EDITORIAL_CHECKLIST_ITEMS.map((item) => {
          const checked = Boolean(values[item.id]);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => toggleItem(item.id)}
              className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                checked
                  ? 'bg-emerald-500/5 border-emerald-500/25'
                  : 'bg-[#090B12] border-[#272B3A] hover:border-[#8B5CF6]/40'
              }`}
            >
              {checked ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <Square className="w-4 h-4 text-[#A1A1AA] shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-semibold leading-snug ${checked ? 'text-emerald-300' : 'text-[#F8FAFC]'}`}>
                    {item.label}
                  </p>
                  {item.critical && (
                    <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase tracking-wider">
                      Required
                    </span>
                  )}
                </div>
                {showGuidance && (
                  <p className="text-[11px] text-[#A1A1AA] leading-relaxed">{item.guidance}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-[#71717A] leading-relaxed border-t border-[#272B3A] pt-3">
        This checklist records editorial review completion. It does not certify factual accuracy or legal compliance.
        Soft Gamer editorial staff remain responsible for verifying all published claims independently.
      </p>
    </div>
  );
}

