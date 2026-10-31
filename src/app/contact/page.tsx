import { Metadata } from 'next';
import { Mail, MessageSquare, AlertCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Us — Soft Gamer Editorial Inquiries',
  description: 'Get in touch with the Soft Gamer editorial desk for tips, corrections, press releases, or technical feedback.',
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Contact Editorial Desk
        </h1>
        <p className="text-lg text-[#A1A1AA] leading-relaxed">
          Reach out to the Soft Gamer staff for news tips, editorial corrections, or technical inquiries.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#171C2B] border border-[#272B3A] flex items-center justify-center text-[#8B5CF6] mb-4">
            <Mail className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#F8FAFC] mb-2">Editorial Inquiries</h2>
          <p className="text-sm text-[#A1A1AA] mb-4">
            For article corrections, feedback on hardware analysis, and guide suggestions.
          </p>
          <div className="text-xs px-3 py-2 rounded bg-[#090B12] text-[#A1A1AA] border border-[#272B3A]">
            [SITE OWNER: Insert official editorial email before launch, e.g. editorial@yourdomain.com]
          </div>
        </div>

        <div className="bg-[#111522] border border-[#272B3A] rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-[#171C2B] border border-[#272B3A] flex items-center justify-center text-[#38BDF8] mb-4">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-[#F8FAFC] mb-2">Press &amp; Review Code</h2>
          <p className="text-sm text-[#A1A1AA] mb-4">
            For developers and publishers submitting review builds or technical documentation.
          </p>
          <div className="text-xs px-3 py-2 rounded bg-[#090B12] text-[#A1A1AA] border border-[#272B3A]">
            [SITE OWNER: Insert press relations contact before launch, e.g. press@yourdomain.com]
          </div>
        </div>
      </div>

      {/* Non-fake Contact Form notice */}
      <div className="bg-[#171C2B] border border-[#272B3A] rounded-2xl p-6 sm:p-8">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC] mb-2">Direct Messaging Form Status</h3>
            <p className="text-sm text-[#A1A1AA] leading-relaxed">
              Interactive messaging and contact form submissions will be enabled alongside our Supabase backend integration in Phase 2. To avoid losing submissions or presenting nonfunctional controls, our web form is currently held offline.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

