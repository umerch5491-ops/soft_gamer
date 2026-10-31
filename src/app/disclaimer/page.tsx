import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Editorial Disclaimer — Soft Gamer',
  description: 'Editorial transparency, hardware testing disclaimers, and intellectual property notices.',
};

export default function DisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Editorial &amp; Testing Disclaimer
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Last updated: October 2026
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. Editorial Independence</h2>
          <p>
            Soft Gamer produces independent critiques, technical investigations, and gameplay guides. Coverage decisions are made exclusively by the editorial team based on interest and relevance to our readership.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">2. Hardware Testing &amp; Overclocking Caution</h2>
          <p>
            Any hardware optimizations, BIOS adjustments, voltage tuning, or operating system modifications discussed in our technical guides involve inherent operational variables. Readers undertake such actions at their own discretion. Soft Gamer does not guarantee specific framerate or thermals across varying silicon quality or unique PC setups.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Trademarks &amp; Copyrights</h2>
          <p>
            All game titles, characters, publisher trademarks, and brand logos mentioned on this website belong to their respective copyright holders. Their reference on Soft Gamer falls under standard editorial fair use for critique, commentary, and news reporting.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Phase 1 Sample Demonstrations</h2>
          <p>
            During Phase 1 frontend development, sample articles are presented strictly as editorial placeholders to evaluate typography, responsiveness, and information hierarchy. They are not intended as real-time breaking news.
          </p>
        </section>

        {/* Website Owner Notice */}
        <div className="p-6 rounded-xl bg-[#111522] border border-[#272B3A] text-sm text-[#A1A1AA]">
          <h3 className="font-semibold text-[#F8FAFC] mb-2">Publisher Configuration Note:</h3>
          <p>
            [SITE OWNER: Validate industry warranty disclaimers with legal counsel before enabling production sponsored reviews or commercial affiliate links.]
          </p>
        </div>
      </div>
    </div>
  );
}

