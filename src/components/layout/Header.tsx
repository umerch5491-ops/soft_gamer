'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

interface HeaderProps {
  currentPath?: string;
}

export function Header({ currentPath }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not render public magazine header inside the admin CMS portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-[#090B12]/90 backdrop-blur-md border-b border-[#272B3A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Soft Gamer Text Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-linear-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center font-black text-white text-base shadow-sm shadow-[#8B5CF6]/40">
            SG
          </span>
          <span className="text-xl font-extrabold tracking-tight text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">
            SOFT<span className="text-[#8B5CF6]">GAMER</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
          {SITE_CONFIG.navLinks.map((link) => {
            const isActive = currentPath === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-[#F8FAFC] bg-[#171C2B] border border-[#272B3A]'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search articles"
            className="p-2 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#171C2B] border border-transparent hover:border-[#272B3A] transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
            className="lg:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#171C2B] border border-transparent hover:border-[#272B3A] transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Accessible Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#111522] border-b border-[#272B3A] px-4 pt-2 pb-6 space-y-1">
          {SITE_CONFIG.navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-[#F8FAFC] hover:bg-[#171C2B] hover:text-[#38BDF8] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#272B3A]">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#38BDF8] bg-[#171C2B]"
            >
              <Search className="w-4 h-4" />
              <span>Search Database</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

