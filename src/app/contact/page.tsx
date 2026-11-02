import { Metadata } from 'next';
import { Mail, Clock, ShieldCheck, Send } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Contact Us — Soft Gamer',
  description: 'Get in touch with the Soft Gamer editorial and publishing team. Send your news tips, game review codes, inquiries, or feedback.',
};

export default function ContactPage() {
  const contactEmail = 'umerjamil126@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Contact Us' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Contact Us
        </h1>
        <p className="text-lg text-[#A1A1AA] leading-relaxed">
          Have a question, feedback, news tip, or review inquiry? We would love to hear from you.
        </p>
      </header>

      {/* Main Contact Card */}
      <div className="bg-linear-to-b from-[#111522] to-[#0D101A] border border-[#272B3A] rounded-2xl p-6 sm:p-10 mb-10 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-[#272B3A]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6] shrink-0">
              <Mail className="w-7 h-7" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-[#A1A1AA] font-semibold">
                Direct Email Contact
              </p>
              <a
                href={`mailto:${contactEmail}`}
                className="text-xl sm:text-2xl font-bold text-[#F8FAFC] hover:text-[#38BDF8] transition-colors break-all"
              >
                {contactEmail}
              </a>
            </div>
          </div>

          <a
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-linear-to-r from-[#8B5CF6] to-[#6D28D9] hover:from-[#7C3AED] hover:to-[#5B21B6] text-white font-semibold text-sm transition-all shadow-lg shadow-[#8B5CF6]/25 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>Send Email</span>
          </a>
        </div>

        {/* Contact Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <div className="p-4 rounded-xl bg-[#090B12] border border-[#272B3A]/80">
            <h3 className="text-sm font-bold text-[#F8FAFC] mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
              News Tips &amp; Stories
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Discovered gaming leaks, technical bugs, or breaking industry news? Send us the details and sources.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090B12] border border-[#272B3A]/80">
            <h3 className="text-sm font-bold text-[#F8FAFC] mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
              Reviews &amp; Press
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Game publishers, indie studios, and PR representatives requesting game coverage or reviews.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#090B12] border border-[#272B3A]/80">
            <h3 className="text-sm font-bold text-[#F8FAFC] mb-1.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              Feedback &amp; Guides
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Suggestions for our walkthroughs, PC performance guides, or corrections on published articles.
            </p>
          </div>
        </div>
      </div>

      {/* Response Time & Guarantee */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
        <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#38BDF8] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[#F8FAFC] mb-1">Expected Response Time</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              We review every email received and aim to respond within 24 to 48 business hours.
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-[#F8FAFC] mb-1">Confidential Tips</h4>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              Anonymous tips and whistleblower contributions are handled with strict journalistic confidentiality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
