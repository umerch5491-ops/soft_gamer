import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function NotFound() {
  const categoryLinks = SITE_CONFIG.navLinks.slice(1);

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#171C2B] border border-[#272B3A] text-[#8B5CF6] flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#8B5CF6]/10">
        <Compass className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8] px-3 py-1 rounded-md bg-[#171C2B] border border-[#272B3A]">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight mt-4 mb-3">
        Level Boundary Exceeded
      </h1>

      <p className="text-[#A1A1AA] text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
        The requested page or article could not be located. It may have been renamed or moved within our archive.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B5CF6] text-[#F8FAFC] font-semibold text-sm hover:bg-[#7c3aed] transition-colors shadow-md shadow-[#8B5CF6]/20"
        >
          <Home className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
        <Link
          href="/search"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#171C2B] border border-[#272B3A] text-[#F8FAFC] font-semibold text-sm hover:border-[#8B5CF6] transition-colors"
        >
          <Search className="w-4 h-4 text-[#38BDF8]" />
          <span>Search Articles</span>
        </Link>
      </div>

      {/* Explore Categories */}
      <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A]">
        <p className="text-xs font-bold uppercase tracking-wider text-[#A1A1AA] mb-4">
          Browse Editorial Hubs
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categoryLinks.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="px-3.5 py-1.5 rounded-lg bg-[#171C2B] border border-[#272B3A] text-xs font-medium text-[#F8FAFC] hover:border-[#38BDF8] hover:text-[#38BDF8] transition-colors"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
