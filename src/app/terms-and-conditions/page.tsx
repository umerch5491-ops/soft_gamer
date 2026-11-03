import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { buildPageMetadata } from '@/lib/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Terms & Conditions — Soft Gamer',
  description: 'Terms and conditions governing the use of Soft Gamer editorial content, technical walkthroughs, and reader services.',
  path: '/terms-and-conditions',
});

export default function TermsAndConditionsPage() {
  const contactEmail = process.env.CONTACT_EMAIL || 'umerjamil126@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Terms & Conditions' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Last Updated: November 3, 2026
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. Agreement to Terms</h2>
          <p>
            By accessing or using <strong className="text-[#F8FAFC]">Soft Gamer</strong> (accessible at www.softgamer.online), you acknowledge that you have read, understood, and agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, you should discontinue using this site immediately.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">2. Intellectual Property Rights</h2>
          <p>
            All original editorial articles, technical analysis, guides, written commentary, graphics, and layout designs published on Soft Gamer are the intellectual property of Soft Gamer and protected by copyright and intellectual property legislation.
          </p>
          <p className="mt-3">
            <strong className="text-[#F8FAFC]">Fair Use &amp; Excerpts:</strong> You may quote brief excerpts (under 100 words) from our articles for non-commercial commentary, news citation, or review purposes, provided that clear attribution and a direct clickable hyperlink to the source article on Soft Gamer are prominently included.
          </p>
          <p className="mt-3">
            <strong className="text-[#F8FAFC]">Prohibited Usage:</strong> Systematic scraping, automated data mining, bulk republishing, or mirroring of our guides and articles without prior written permission is strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Permitted Reader Conduct</h2>
          <p>
            You agree to use Soft Gamer only for lawful purposes. You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li>Attempt to bypass security measures, probe vulnerabilities, or compromise server infrastructure.</li>
            <li>Launch automated scripts, crawlers, or denial-of-service traffic that burdens our hosting infrastructure.</li>
            <li>Use the website in any manner that impairs the availability, accessibility, or performance of the service for other readers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Accuracy of Information &amp; Technical Advice</h2>
          <p>
            The content on Soft Gamer is provided for general informational, educational, and entertainment purposes only. While our writers strive for rigorous accuracy, the gaming landscape updates constantly through software patches, server hotfixes, and driver updates. We do not warrant that all game guides, performance benchmarks, or release schedules will remain perpetually error-free or up-to-date.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">5. Third-Party Links &amp; External Services</h2>
          <p>
            Soft Gamer may contain links to external third-party websites (such as Steam, Epic Games Store, official game publisher portals, or community platforms). These links are provided for reader convenience only. Soft Gamer does not endorse, control, or assume responsibility for the content, privacy policies, or practices of third-party websites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">6. Limitation of Liability</h2>
          <p>
            Under no circumstances shall Soft Gamer, its editors, authors, or affiliates be liable for any direct, indirect, incidental, consequential, or punitive damages arising from:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li>Your use of or inability to use this website.</li>
            <li>Any hardware alterations, overclocking attempts, firmware updates, or config modifications performed based on our guides.</li>
            <li>Game save corruption, bans, or account penalties incurred from game modifications or software discussed on the site.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">7. Modifications to Terms</h2>
          <p>
            We reserve the right to amend or replace these Terms &amp; Conditions at any time. Changes will become effective immediately upon posting to this page. Continued use of Soft Gamer following any revisions indicates your acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">8. Contact Information</h2>
          <p>
            For any legal inquiries, intellectual property concerns, or questions regarding these Terms &amp; Conditions, please contact us at:
          </p>
          <div className="mt-4 p-5 rounded-xl bg-[#111522] border border-[#272B3A] text-sm space-y-1">
            <p className="font-semibold text-[#F8FAFC]">Soft Gamer Publishing</p>
            <p>
              Email:{' '}
              <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-mono">
                {contactEmail}
              </a>
            </p>
            <p>Website: www.softgamer.online</p>
          </div>
        </section>
      </div>
    </div>
  );
}
