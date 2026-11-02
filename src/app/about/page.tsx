import { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Cpu, Gamepad2, Compass, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us — Soft Gamer Editorial & Mission',
  description: 'Learn about Soft Gamer, our editorial mission, testing standards, and commitment to independent, technical gaming journalism.',
};

export default function AboutPage() {
  const contactEmail = 'umerjamil126@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          About Soft Gamer
        </h1>
        <p className="text-lg text-[#A1A1AA] leading-relaxed">
          Independent gaming journalism dedicated to system architecture breakdowns, in-depth walkthroughs, and authentic critiques.
        </p>
      </header>

      <div className="space-y-12 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        {/* Our Mission */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Our Mission</h2>
          <p className="mb-4">
            Welcome to <strong className="text-[#F8FAFC]">Soft Gamer</strong>. In a digital landscape overwhelmed by recycled press releases, rushed reviews, and sensationalized headlines, Soft Gamer was created with a singular focus: delivering thoughtful, authentic, and technically grounded gaming content that respects the reader&apos;s time and intelligence.
          </p>
          <p>
            Whether analyzing the latency impact of new rendering pipelines, deconstructing complex game economies, or helping you conquer end-game raid bosses, our goal is to provide insightful coverage that enriches your gaming experience.
          </p>
        </section>

        {/* Pillars of Coverage Grid */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-6">What We Deliver</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 not-prose">
            <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">PC Hardware &amp; Performance</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Silicon scaling, frametime stability, DirectStorage optimization, and graphics settings guides that help you squeeze the highest fidelity from your setup.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Definitive Game Guides</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Step-by-step walkthroughs, hidden secrets, leveling routes, and mechanic analyses created by seasoned players who actually play the titles they cover.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981]">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Platform &amp; Console Insights</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Cross-platform coverage spanning PlayStation, Xbox, Nintendo Switch, Steam Deck, and mobile gaming ecosystems.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111522] border border-[#272B3A] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Critical &amp; Honest Reviews</h3>
              <p className="text-sm text-[#A1A1AA] leading-relaxed">
                Evaluations built on real gameplay experience. We scrutinize gameplay balance, narrative pacing, audio design, and technical bugs transparently.
              </p>
            </div>
          </div>
        </section>

        {/* Editorial Standards & Integrity */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-4">Editorial Integrity &amp; Transparency</h2>
          <div className="space-y-4">
            <p>
              We adhere strictly to core journalistic principles:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[#A1A1AA]">
              <li>
                <strong className="text-[#F8FAFC]">Independence:</strong> Our reviews and opinions are never dictated, altered, or pre-approved by publishers, hardware manufacturers, or PR agencies.
              </li>
              <li>
                <strong className="text-[#F8FAFC]">Disclosure:</strong> When review codes or sample hardware are supplied by publishers, we explicitly disclose it in the article.
              </li>
              <li>
                <strong className="text-[#F8FAFC]">Corrections:</strong> We value accuracy. If a factual error occurs, we correct it promptly with a clear amendment note.
              </li>
              <li>
                <strong className="text-[#F8FAFC]">No Fabricated Claims:</strong> Every benchmark, configuration guide, and game tip is tested and validated before publication.
              </li>
            </ul>
          </div>
        </section>

        {/* Get in Touch Banner */}
        <div className="p-8 rounded-2xl bg-linear-to-r from-[#111522] to-[#171C2B] border border-[#272B3A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B5CF6]">
              <Mail className="w-4 h-4" />
              <span>Editorial Desk</span>
            </div>
            <h3 className="text-xl font-bold text-[#F8FAFC]">Have Questions or Feedback?</h3>
            <p className="text-sm text-[#A1A1AA] max-w-lg">
              We welcome tips, story ideas, reader corrections, and inquiries from creators and publishers.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-semibold transition-all shrink-0"
          >
            <span>Contact Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Publisher Information Box */}
        <div className="p-6 rounded-2xl bg-[#090B12] border border-[#272B3A] text-xs text-[#A1A1AA] space-y-2">
          <p className="font-semibold text-[#F8FAFC] text-sm">Publisher &amp; Contact Details</p>
          <p>
            Soft Gamer is an independent digital publication. For business inquiries, licensing, press releases, or editorial contact, reach us directly at{' '}
            <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-mono">
              {contactEmail}
            </a>.
          </p>
        </div>
      </div>
    </div>
  );
}
