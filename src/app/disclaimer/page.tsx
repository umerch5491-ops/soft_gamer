import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorial & Hardware Disclaimer — Soft Gamer',
  description: 'Soft Gamer disclaimer: hardware testing precautions, trademark acknowledgments, review policy, and editorial disclosures.',
};

export default function DisclaimerPage() {
  const contactEmail = process.env.CONTACT_EMAIL || 'umerjamil126@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Disclaimer' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Editorial &amp; Testing Disclaimer
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Last Updated: November 3, 2026
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        {/* General Disclaimer */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. General Information</h2>
          <p>
            The information provided by <strong className="text-[#F8FAFC]">Soft Gamer</strong> on www.softgamer.online is for general educational, analytical, and entertainment purposes only. While we make every effort to maintain accurate and up-to-date information, Soft Gamer makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information contained on this website.
          </p>
        </section>

        {/* Hardware & Overclocking Caution Box */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#111522] border border-amber-500/20 space-y-4">
          <div className="flex items-center gap-3 text-amber-400">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <h2 className="text-xl font-bold text-[#F8FAFC]">2. Hardware Overclocking &amp; System Tuning Caution</h2>
          </div>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            Our technical articles frequently discuss BIOS settings, GPU/CPU undervolting, memory sub-timing adjustments, operating system tweaks, configuration file edits, and cooling optimizations.
          </p>
          <p className="text-sm sm:text-base text-[#A1A1AA] leading-relaxed">
            <strong className="text-amber-300">Important:</strong> Hardware modifications, voltage adjustments, and firmware flashing carry inherent risks, including silicon degradation, system instability, voided manufacturer warranties, or permanent component failure. Any adjustments you perform based on our walkthroughs are done entirely at your own risk. Soft Gamer is not liable for damaged hardware or lost data.
          </p>
        </section>

        {/* Trademarks & Copyrights Notice */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Trademarks &amp; Copyright Notice</h2>
          <p>
            All video game titles, character names, publisher trademarks, logos, screenshots, and artwork referenced across Soft Gamer belong to their respective copyright and trademark owners. These include, but are not limited to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li>Sony Interactive Entertainment (PlayStation, DualSense)</li>
            <li>Microsoft Corporation (Xbox, DirectX, Windows)</li>
            <li>Nintendo Co., Ltd. (Nintendo Switch)</li>
            <li>Valve Corporation (Steam, Steam Deck)</li>
            <li>Epic Games, Electronic Arts, Ubisoft, Activision Blizzard, Take-Two Interactive, and other game publishers.</li>
          </ul>
          <p className="mt-3">
            Reference to these trademarks on Soft Gamer is strictly for critique, commentary, educational walkthroughs, and news reporting under Fair Use principles (17 U.S. Code § 107). Soft Gamer is an independent publication and is not affiliated with, endorsed by, or sponsored by any console maker or game publisher unless explicitly stated.
          </p>
        </section>

        {/* Game Patches & Live Service Updates */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Game Updates &amp; Live Service Evolution</h2>
          <p>
            Modern video games frequently receive balance patches, seasonal adjustments, content expansions, and server hotfixes. Consequently, specific stats, weapon tiers, quest objectives, or optimization settings described in our guides may change over time. Readers are encouraged to verify game version numbers mentioned in our articles.
          </p>
        </section>

        {/* Review Codes & Commercial Transparency */}
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">5. Review Policy &amp; Commercial Transparency</h2>
          <p>
            In accordance with FTC guidelines and journalistic ethics:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li>
              When review codes or hardware review samples are provided by game publishers or hardware manufacturers, we explicitly disclose this in the article.
            </li>
            <li>
              Providing a review copy does not guarantee a favorable score, positive coverage, or editorial immunity. Our critiques remain completely independent and unbiased.
            </li>
            <li>
              Some articles may contain affiliate links to authorized retailers. If you click on an affiliate link and make a purchase, Soft Gamer may earn a small commission at no additional cost to you.
            </li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="pt-4">
          <div className="p-6 rounded-2xl bg-[#090B12] border border-[#272B3A] text-sm space-y-2">
            <div className="flex items-center gap-2 text-[#F8FAFC] font-semibold text-base mb-1">
              <ShieldAlert className="w-5 h-5 text-[#38BDF8]" />
              <span>Questions or Trademark Inquiries</span>
            </div>
            <p className="text-xs text-[#A1A1AA]">
              If you are a copyright or trademark owner with concerns regarding any material published on Soft Gamer, please contact our editorial desk immediately:
            </p>
            <p className="text-xs text-[#A1A1AA]">
              Email:{' '}
              <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-mono">
                {contactEmail}
              </a>
            </p>
            <p className="text-xs text-[#A1A1AA]">Website: www.softgamer.online</p>
          </div>
        </section>
      </div>
    </div>
  );
}
