import React from 'react';

/**
 * Soft Gamer Google AdSense-Ready Placement Component
 *
 * Implements strict compliance with Google AdSense Publisher Policies:
 * - Clear, unambiguous "ADVERTISEMENT" identification
 * - Non-intrusive container with defined minimum dimensions to eliminate CLS
 * - Strictly disabled by default (renders nothing on public site before approval)
 * - Safe spacing away from clickable navigation, menus, and article controls
 * - No deceptive layouts or artificial click triggers
 */

export type AdSlotPosition =
  | 'article-top'
  | 'article-inline'
  | 'article-bottom'
  | 'sidebar'
  | 'feed-between';

interface AdSlotProps {
  position: AdSlotPosition;
  className?: string;
  forceShowForDemo?: boolean;
}

// In production before AdSense approval, this remains false to prevent empty layout boxes
const ADS_ENABLED = process.env.NEXT_PUBLIC_ADS_ENABLED === 'true';

export function AdSlot({ position, className = '', forceShowForDemo = false }: AdSlotProps) {
  // If ads are not officially activated and not in demo/audit preview, render nothing
  if (!ADS_ENABLED && !forceShowForDemo) {
    return null;
  }

  // Positioning-specific dimensions & styling
  const getSlotConfig = () => {
    switch (position) {
      case 'article-top':
        return {
          dimensions: 'min-h-[90px] max-w-[728px]',
          label: 'Advertisement — Top Banner',
        };
      case 'article-inline':
        return {
          dimensions: 'min-h-[250px] max-w-[336px]',
          label: 'Advertisement — In-Article Contextual',
        };
      case 'article-bottom':
        return {
          dimensions: 'min-h-[100px] max-w-[728px]',
          label: 'Advertisement — Editorial Footer',
        };
      case 'sidebar':
        return {
          dimensions: 'min-h-[600px] max-w-[300px]',
          label: 'Advertisement — Sidebar Skyscraper',
        };
      case 'feed-between':
        return {
          dimensions: 'min-h-[120px] w-full',
          label: 'Advertisement — Magazine Feed Break',
        };
    }
  };

  const config = getSlotConfig();

  return (
    <aside
      aria-label="Advertisement"
      className={`my-8 mx-auto flex flex-col items-center justify-center transition-all ${className}`}
    >
      {/* Policy-compliant subtle disclosure tag */}
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#71717A] mb-1.5 select-none">
        Advertisement
      </span>

      {/* Ad content container */}
      <div
        className={`w-full ${config.dimensions} rounded-xl bg-[#111522]/80 border border-[#272B3A]/60 flex flex-col items-center justify-center p-4 text-center`}
      >
        <span className="text-xs font-semibold text-[#A1A1AA]/70">
          Soft Gamer Ad Placement ({position})
        </span>
        <span className="text-[10px] text-[#71717A] mt-1">
          Reserved for Google AdSense programmatic display
        </span>
      </div>
    </aside>
  );
}

