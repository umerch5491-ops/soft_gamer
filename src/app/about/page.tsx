import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'About Soft Gamer — Editorial Standards & Mission',
  description: 'Learn about the Soft Gamer editorial vision, technical coverage standards, and our commitment to independent gaming analysis.',
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'About Us' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          About Soft Gamer
        </h1>
        <p className="text-lg text-[#A1A1AA] leading-relaxed">
          Independent gaming journalism focused on system performance, architectural breakdowns, and structured gameplay analysis.
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">Our Editorial Philosophy</h2>
          <p>
            Soft Gamer was conceived as a high-signal publication for gaming enthusiasts who want technical depth over sensationalism. In an industry increasingly dominated by rapid content cycles, our editorial goal is to provide measured, well-structured critiques and engineering-level explanations of modern game mechanics and platforms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">What We Cover</h2>
          <ul className="list-disc pl-6 space-y-2 text-[#A1A1AA]">
            <li><strong>Hardware Benchmarks &amp; Low-Level APIs:</strong> From mesh shading to DirectStorage and operating system latency optimizations.</li>
            <li><strong>Console Architectures:</strong> Comprehensive tracking of platform transitions, hardware decompression blocks, and storage throughput.</li>
            <li><strong>Tactical Guides:</strong> Analytical walkthroughs that break down progression curves and resource economics.</li>
            <li><strong>Critical Reviews:</strong> Objective gameplay appraisals without arbitrary commercial scores or fabricated testing claims.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">Editorial Independence &amp; Integrity</h2>
          <p>
            All opinions expressed across Soft Gamer represent the editorial judgment of our writers. We maintain strict separation between editorial content and future programmatic advertising channels.
          </p>
        </section>

        {/* Website Owner Notice Box as required */}
        <div className="p-6 rounded-xl bg-[#111522] border border-[#272B3A] text-sm text-[#A1A1AA]">
          <h3 className="font-semibold text-[#F8FAFC] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6]"></span>
            Publisher Notice
          </h3>
          <p>
            [NOTE FOR SITE OWNER: Update this section with your registered publishing entity, full editorial masthead, and office registration details prior to public release.]
          </p>
        </div>
      </div>
    </div>
  );
}

