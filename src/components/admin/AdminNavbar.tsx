'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Menu,
  Plus,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

interface AdminNavbarProps {
  onMenuToggle: () => void;
  title?: string;
}

export function AdminNavbar({ onMenuToggle, title = 'Editorial Management' }: AdminNavbarProps) {
  const router = useRouter();
  const { user, isDemoMode, logout, switchRole } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#090B12]/95 backdrop-blur-md border-b border-[#272B3A] px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Section title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label="Open Navigation"
          className="lg:hidden p-2 rounded-lg text-[#A1A1AA] hover:text-[#F8FAFC] hover:bg-[#171C2B] border border-transparent hover:border-[#272B3A] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-[#F8FAFC] tracking-tight truncate">
          {title}
        </h1>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Demo status tag */}
        {isDemoMode && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Demo Mode (Unlinked Supabase)</span>
          </span>
        )}

        {/* Quick action: + New Article */}
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs font-semibold transition-all shadow-sm shadow-[#8B5CF6]/30"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Article</span>
        </Link>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#171C2B] text-[#A1A1AA] hover:text-[#F8FAFC] border border-transparent hover:border-[#272B3A] transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-[#171C2B] border border-[#272B3A] flex items-center justify-center font-bold text-xs text-[#8B5CF6]">
              {user ? user.name.charAt(0) : 'U'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111522] border border-[#272B3A] rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-2 border-b border-[#272B3A]">
                <p className="text-xs font-bold text-[#F8FAFC]">{user?.name || 'Guest Editor'}</p>
                <p className="text-[11px] text-[#A1A1AA] truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-[#8B5CF6] uppercase">
                  Role: {user?.role || 'editor'}
                </span>
              </div>

              {/* Demo role switcher */}
              {isDemoMode && (
                <div className="py-2 px-1 border-b border-[#272B3A]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#A1A1AA] px-2 mb-1">
                    Demo Role Switcher:
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('admin');
                        setProfileOpen(false);
                      }}
                      className={`px-2 py-1 text-xs rounded font-medium text-left ${
                        user?.role === 'admin' ? 'bg-[#8B5CF6] text-white' : 'text-[#A1A1AA] hover:bg-[#171C2B]'
                      }`}
                    >
                      Admin
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        switchRole('editor');
                        setProfileOpen(false);
                      }}
                      className={`px-2 py-1 text-xs rounded font-medium text-left ${
                        user?.role === 'editor' ? 'bg-[#8B5CF6] text-white' : 'text-[#A1A1AA] hover:bg-[#171C2B]'
                      }`}
                    >
                      Editor
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
