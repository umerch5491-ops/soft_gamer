'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SITE_CONFIG } from '@/lib/constants';

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not render public magazine footer inside the admin CMS portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-[#090B12] border-t border-[#272B3A] mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand & Editorial Mission */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-linear-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center font-black text-white text-base">
                SG
              </span>
              <span className="text-xl font-extrabold tracking-tight text-[#F8FAFC]">
                SOFT<span className="text-[#8B5CF6]">GAMER</span>
              </span>
            </Link>
            <p className="text-sm text-[#A1A1AA] leading-relaxed max-w-sm">
              {SITE_CONFIG.editorialDescription}
            </p>
            <div className="text-xs text-[#A1A1AA]/80 pt-2">
              <p>Built with Next.js App Router &amp; TypeScript.</p>
              <p className="mt-1">Architected for scalable organic editorial delivery.</p>
            </div>
          </div>

          {/* Editorial Hubs */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Editorial Categories
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {SITE_CONFIG.navLinks.slice(1).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] hover:text-[#38BDF8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F8FAFC]">
              Publishing &amp; Legal
            </h4>
            <ul className="space-y-2 text-sm">
              {SITE_CONFIG.footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#A1A1AA] hover:text-[#38BDF8] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dynamic Copyright Subfooter */}
        <div className="mt-12 pt-8 border-t border-[#272B3A] flex flex-col sm:flex-row items-center justify-between text-xs text-[#A1A1AA] gap-4">
          <p>© {currentYear} Soft Gamer. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Independent gaming journalism &amp; editorial guides.
          </p>
        </div>
      </div>
    </footer>
  );
}

