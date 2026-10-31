'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  FolderTree,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  ShieldAlert,
  BarChart2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export function AdminSidebar({ isOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const { user, isDemoMode } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'All Articles', href: '/admin/articles', icon: FileText, exact: true },
    { label: 'New Article', href: '/admin/articles/new', icon: PlusCircle },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { label: 'SEO Audit', href: '/admin/seo', icon: BarChart2 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#090B12] border-r border-[#272B3A] flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header / Brand */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#272B3A]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-linear-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center font-black text-white text-sm shadow-sm shadow-[#8B5CF6]/40">
              SG
            </span>
            <div>
              <span className="text-base font-extrabold tracking-tight text-[#F8FAFC]">
                SOFT<span className="text-[#8B5CF6]">GAMER</span>
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[#38BDF8]">
                Editorial CMS
              </span>
            </div>
          </Link>
        </div>

        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="mx-4 mt-4 p-2.5 rounded-xl bg-[#171C2B] border border-amber-500/30 flex items-center gap-2 text-xs text-amber-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="truncate">
              <span className="font-bold">Demo Mode Active</span>
              <p className="text-[10px] text-[#A1A1AA]">Local mock persistence</p>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="p-4 space-y-1.5 flex-grow overflow-y-auto">
          {navItems.map(item => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#171C2B] text-[#F8FAFC] border border-[#8B5CF6]/40 shadow-sm shadow-[#8B5CF6]/10'
                    : 'text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#111522]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#8B5CF6]' : 'text-[#A1A1AA]'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer: User profile & public link */}
        <div className="p-4 border-t border-[#272B3A] space-y-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#111522] hover:bg-[#171C2B] text-xs font-semibold text-[#38BDF8] border border-[#272B3A] transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <span>View Public Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          {user && (
            <div className="flex items-center gap-3 px-1 pt-1">
              <div className="w-8 h-8 rounded-full bg-[#171C2B] border border-[#272B3A] flex items-center justify-center font-bold text-xs text-[#8B5CF6]">
                {user.name.charAt(0)}
              </div>
              <div className="truncate flex-grow">
                <p className="text-xs font-bold text-[#F8FAFC] truncate">{user.name}</p>
                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#8B5CF6]/20 text-[#8B5CF6] uppercase">
                  {user.role}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

