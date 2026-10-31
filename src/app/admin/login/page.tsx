'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Info,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isDemoMode } = useAuth();

  const [email, setEmail] = useState('editor@softgamer.dev');
  const [password, setPassword] = useState('demo-password');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Authentication failed');
    }
  };

  const handleQuickDemoLogin = async (role: 'admin' | 'editor') => {
    setIsLoading(true);
    const demoEmail = role === 'admin' ? 'admin@softgamer.dev' : 'editor@softgamer.dev';
    const result = await login(demoEmail, 'demo-password');
    setIsLoading(false);
    if (result.success) {
      router.push('/admin');
    }
  };

  return (
    <div className="min-h-screen bg-[#090B12] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Public Magazine</span>
        </Link>

        {/* Card */}
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Logo & Title */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#8B5CF6] to-[#38BDF8] flex items-center justify-center font-black text-white text-lg mx-auto shadow-md shadow-[#8B5CF6]/30">
              SG
            </div>
            <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
              Soft Gamer CMS
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Staff &amp; Editorial Publishing Portal
            </p>
          </div>

          {/* Demo Mode Notice */}
          {isDemoMode && (
            <div className="p-3.5 rounded-xl bg-[#171C2B] border border-amber-500/30 text-xs text-[#A1A1AA] space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Local Development Demo Mode</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Supabase credentials are not connected yet. Click a quick login button below to explore the dashboard as an Admin or Staff Editor.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('admin')}
                  className="px-3 py-1.5 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Enter as Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemoLogin('editor')}
                  className="px-3 py-1.5 bg-[#111522] hover:bg-[#272B3A] text-[#F8FAFC] font-semibold rounded-lg text-xs border border-[#272B3A] transition-colors"
                >
                  Enter as Editor
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
              {error}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="editor@softgamer.dev"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20 disabled:opacity-50"
            >
              <span>{isLoading ? 'Signing In...' : 'Sign In to Portal'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Security policy footnote */}
          <div className="pt-2 text-center text-[11px] text-[#A1A1AA] flex items-center justify-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Public user registrations are disabled by security policy.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
