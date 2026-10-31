import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Soft Gamer',
  description: 'Terms governing the reading, referencing, and fair use of Soft Gamer editorial content.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Last updated: October 2026
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing or browsing Soft Gamer, you agree to comply with and be bound by these Terms &amp; Conditions. If you disagree with any part of these terms, please discontinue use of the website.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">2. Intellectual Property Rights</h2>
          <p>
            All original editorial commentary, articles, guides, diagrams, and written analysis published on Soft Gamer are protected by intellectual property laws. Readers may quote short excerpts for critical review or discussion with clear attribution and a link to the original article. Whole-cloth reproduction or automated scraping without written consent is prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Permitted Reader Use</h2>
          <p>
            You agree to use Soft Gamer only for lawful informational and personal reading purposes. You agree not to attempt security circumvention, launch denial-of-service traffic, or interfere with normal server operations.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Limitation of Liability</h2>
          <p>
            Articles, guides, and hardware tuning suggestions are published for general educational and informational purposes. Soft Gamer and its contributors will not be held liable for any damages, hardware issues, or losses arising from application of suggested configurations.
          </p>
        </section>

        {/* Website Owner Notice */}
        <div className="p-6 rounded-xl bg-[#111522] border border-[#272B3A] text-sm text-[#A1A1AA]">
          <h3 className="font-semibold text-[#F8FAFC] mb-2">Publisher Configuration Note:</h3>
          <p>
            [SITE OWNER: Review and update the governing law, legal jurisdiction, and corporate entity clauses with qualified counsel prior to commercial launch.]
          </p>
        </div>
      </div>
    </div>
  );
}

