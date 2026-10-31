import Link from 'next/link';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  badge?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

export function SectionHeading({
  title,
  subtitle,
  badge,
  viewAllHref,
  viewAllLabel = 'View All',
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#272B3A] gap-4">
      <div>
        {badge && (
          <span className="inline-block text-xs font-semibold tracking-wider uppercase text-[#8B5CF6] mb-2 px-2.5 py-0.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/30">
            {badge}
          </span>
        )}
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#F8FAFC]">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm md:text-base text-[#A1A1AA] mt-1 max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center text-sm font-medium text-[#38BDF8] hover:text-[#8B5CF6] transition-colors group shrink-0"
        >
          <span>{viewAllLabel}</span>
          <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
        </Link>
      )}
    </div>
  );
}

