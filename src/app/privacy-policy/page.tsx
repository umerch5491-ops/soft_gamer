import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — Soft Gamer',
  description: 'Understand how Soft Gamer handles reader privacy, data transparency, and technical logs.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Last updated: October 2026
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. Overview and Commitment</h2>
          <p>
            Soft Gamer respects the privacy of its readers. This Privacy Policy outlines the general nature of information processed when you navigate our editorial magazine. We do not sell personal data to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">2. Data Collection in Phase 1</h2>
          <p>
            During Phase 1, Soft Gamer operates strictly as a static and server-rendered editorial platform. We do not maintain user registration accounts, database records of your reading history, or personal profile profiles. Standard web hosting server logs (such as IP address, browser user-agent, and requested route) are automatically generated for security diagnostics and CDN performance monitoring.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Cookies and Future Advertising</h2>
          <p>
            This website currently does not deploy advertising tracking cookies. In future operational phases, we plan to integrate Google AdSense and privacy-respecting analytics to fund ongoing journalism. When implemented, readers will be provided with explicit cookie consent mechanisms compliant with applicable regulations (GDPR/CCPA).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Third-Party External Links</h2>
          <p>
            Our articles may include links to external websites, game publisher documentation, or storefronts. Soft Gamer is not responsible for the privacy practices or content of third-party platforms.
          </p>
        </section>

        {/* Required Website Owner Notice */}
        <div className="p-6 rounded-xl bg-[#111522] border border-[#272B3A] text-sm text-[#A1A1AA]">
          <h3 className="font-semibold text-[#F8FAFC] mb-2">Publisher Configuration Note:</h3>
          <p>
            [SITE OWNER: Prior to production commercial launch, replace this general placeholder framework with your attorney-reviewed privacy statements, designated Data Protection Officer contact, and official registered entity details.]
          </p>
        </div>
      </div>
    </div>
  );
}

