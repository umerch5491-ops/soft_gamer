'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ArrowLeft,
  Info,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/authContext';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, isLoading: isAuthLoading, isDemoMode } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already authenticated, redirect straight to dashboard
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace('/admin');
    }
  }, [user, isAuthLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const handleQuickAdminLogin = async () => {
    setIsSubmitting(true);
    setError(null);
    const adminEmail = 'admin@softgamer.dev';
    const adminPass = 'demo-password';
    setEmail(adminEmail);
    setPassword(adminPass);

    const result = await login(adminEmail, adminPass);
    setIsSubmitting(false);
    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error || 'Failed to authenticate');
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

        {/* Login Card */}
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
              Administration &amp; Publishing Portal
            </p>
          </div>

          {/* Quick Access Helper */}
          <div className="p-3.5 rounded-xl bg-[#171C2B] border border-[#272B3A] text-xs text-[#A1A1AA] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#F8FAFC] font-semibold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Quick Admin Access</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] font-medium">
                {isDemoMode ? 'Demo Mode' : 'Instant Login'}
              </span>
            </div>
            <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
              Click below to instantly sign in with Admin privileges:
            </p>
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              disabled={isSubmitting}
              className="w-full py-2.5 px-3 bg-[#8B5CF6] hover:bg-[#7c3aed] text-white font-semibold rounded-lg text-xs transition-colors cursor-pointer text-center disabled:opacity-50 shadow-md shadow-[#8B5CF6]/20"
            >
              Log In as Admin
            </button>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed">
              {error}
            </div>
          )}

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@softgamer.dev or umerjamil126@gmail.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden focus:border-[#8B5CF6] transition-colors"
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
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden focus:border-[#8B5CF6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#F8FAFC] transition-colors p-1 rounded-md focus:outline-hidden cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-[#38BDF8]" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20 disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Portal'}</span>
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
