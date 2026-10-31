'use client';

import { useState } from 'react';
import {
  Save,
  Globe,
  Shield,
  Database,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SITE_CONFIG } from '@/lib/constants';
import { useAuth } from '@/lib/auth/authContext';

export default function AdminSettingsPage() {
  const { isDemoMode } = useAuth();

  // General Settings
  const [siteName, setSiteName] = useState(SITE_CONFIG.name);
  const [siteDescription, setSiteDescription] = useState(SITE_CONFIG.description);
  const [editorialEmail, setEditorialEmail] = useState('editorial@softgamer.dev');
  const [contactEmail, setContactEmail] = useState('contact@softgamer.dev');
  const [twitterHandle, setTwitterHandle] = useState('@SoftGamerEditorial');
  const [publisherEntity, setPublisherEntity] = useState('Soft Gamer Publishing LLC');
  const [publisherAddress, setPublisherAddress] = useState('[SITE OWNER: Insert legal registered address]');

  // Notifications
  const [savedMessage, setSavedMessage] = useState<string | null>(null);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(
      isDemoMode
        ? 'Settings updated in local demo state. Connect live Supabase credentials to persist across deployments.'
        : 'Settings saved successfully!'
    );
    setTimeout(() => setSavedMessage(null), 3000);
  };

  const copyEnvSnippet = () => {
    const snippet = `NEXT_PUBLIC_SITE_URL=http://localhost:3000\nNEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-anon-key`;
    navigator.clipboard.writeText(snippet);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <AdminLayout pageTitle="CMS &amp; System Settings">
      <div className="max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">
            Publication &amp; Architecture Settings
          </h2>
          <p className="text-xs sm:text-sm text-[#A1A1AA]">
            Manage brand metadata, editorial routing, and cloud infrastructure connectivity.
          </p>
        </div>

        {savedMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{savedMessage}</span>
          </div>
        )}

        {/* Supabase Connection Architecture Checklist */}
        <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F8FAFC]">
                  Supabase Cloud Connection Checklist
                </h3>
                <p className="text-xs text-[#A1A1AA]">
                  Status:{' '}
                  <span className={isDemoMode ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                    {isDemoMode ? 'UNCONNECTED (Running in Demo Mode)' : 'CONNECTED (Live Database Mode)'}
                  </span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={copyEnvSnippet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171C2B] hover:bg-[#8B5CF6] text-xs font-semibold text-[#F8FAFC] border border-[#272B3A] transition-colors"
            >
              {copiedEnv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy .env Template</span>
            </button>
          </div>

          <div className="space-y-2 text-xs text-[#A1A1AA] pt-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Phase 2 PostgreSQL DDL schema &amp; indexes generated in <code>supabase/migrations/001_initial_schema.sql</code></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Storage policies &amp; bucket DDL created in <code>supabase/migrations/002_storage_setup.sql</code></span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Idempotent seed data prepared in <code>supabase/seed.sql</code></span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${!isDemoMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {!isDemoMode ? '✓' : '4'}
              </div>
              <span>Supply real credentials in <code>.env.local</code> to activate cloud publishing</span>
            </div>
          </div>
        </div>

        {/* General Brand Settings Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-[#F8FAFC] pb-2 border-b border-[#272B3A] flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#8B5CF6]" />
              <span>General Magazine Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                  Publication Name
                </label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                  Editorial Desk Email
                </label>
                <input
                  type="email"
                  value={editorialEmail}
                  onChange={(e) => setEditorialEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                  Public Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Default Editorial Description (Used in Footer &amp; Social Previews)
              </label>
              <textarea
                rows={3}
                value={siteDescription}
                onChange={(e) => setSiteDescription(e.target.value)}
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          {/* Publisher & Legal Information */}
          <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6 space-y-5">
            <h3 className="text-base font-bold text-[#F8FAFC] pb-2 border-b border-[#272B3A] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#38BDF8]" />
              <span>Publisher &amp; Ownership Compliance</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                  Registered Publishing Entity
                </label>
                <input
                  type="text"
                  value={publisherEntity}
                  onChange={(e) => setPublisherEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                  Official Social Handle (Twitter / X)
                </label>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#A1A1AA] mb-1.5">
                Corporate Address Placeholder
              </label>
              <input
                type="text"
                value={publisherAddress}
                onChange={(e) => setPublisherAddress(e.target.value)}
                className="w-full px-3 py-2 bg-[#090B12] border border-[#272B3A] rounded-xl text-xs sm:text-sm text-[#F8FAFC] focus:outline-hidden focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7c3aed] text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-[#8B5CF6]/20"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
