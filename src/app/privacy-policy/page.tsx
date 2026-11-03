import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Privacy Policy — Soft Gamer',
  description: 'Soft Gamer privacy policy covering cookies, Google AdSense advertising, data collection, GDPR, CCPA, and your opt-out rights.',
  alternates: {
    canonical: '/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy — Soft Gamer',
    description: 'Soft Gamer privacy policy covering cookies, Google AdSense advertising, data collection, GDPR, CCPA, and your opt-out rights.',
    url: `${SITE_URL}/privacy-policy`,
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  const contactEmail = process.env.CONTACT_EMAIL || 'umerjamil126@gmail.com';
  const siteUrl = 'https://www.softgamer.online';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#A1A1AA]">Last Updated: November 3, 2026</p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. Introduction</h2>
          <p>
            At <strong className="text-[#F8FAFC]">Soft Gamer</strong> (accessible at {siteUrl}), the privacy of our visitors is one of our primary priorities. This Privacy Policy outlines the types of information collected and recorded by Soft Gamer and how we use it.
          </p>
          <p className="mt-3">
            If you have questions or require more information about our Privacy Policy, please contact us at{' '}
            <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-medium">{contactEmail}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">2. Cookies</h2>
          <p>
            Like most websites, Soft Gamer uses cookies. Cookies are small text files stored on your device when you visit a website. We use cookies to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Remember your preferences and settings</li>
            <li>Understand how visitors navigate our site (analytics)</li>
            <li>Serve relevant advertisements through our advertising partners</li>
          </ul>
          <p className="mt-3">
            You can control or disable cookies through your browser settings. Note that disabling cookies may affect the functionality of this and many other websites you visit.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Google AdSense & Advertising Cookies</h2>
          <p>
            Soft Gamer uses Google AdSense to display advertisements. Google AdSense uses cookies, including the DoubleClick cookie (DART cookie), to serve ads based on a user&apos;s prior visits to our site and other sites on the internet.
          </p>
          <p className="mt-3">
            Google uses these cookies to serve ads to our visitors based on their visit to www.softgamer.online and other websites on the internet. Third-party vendors, including Google, use cookies to serve ads based on prior visits to our website. Google&apos;s use of the DART cookie enables it to serve ads to our users based on their visit to our sites.
          </p>
          <p className="mt-3">
            You may opt out of the use of the DART cookie by visiting the Google ad and content network privacy policy or by visiting the Google Ads Settings page:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>
              <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline">
                https://adssettings.google.com
              </a>
            </li>
            <li>
              <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#38BDF8] hover:underline">
                https://www.aboutads.info/choices/
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Log Files & Technical Data</h2>
          <p>
            Soft Gamer follows standard procedures of using log files. These files log visitors when they access websites. The information collected includes:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Internet Protocol (IP) addresses</li>
            <li>Browser type and operating system</li>
            <li>Internet Service Provider (ISP)</li>
            <li>Date and time stamps</li>
            <li>Referring and exit pages, number of clicks</li>
          </ul>
          <p className="mt-3">This information is not linked to any personally identifiable information and is used to analyze trends and improve site performance.</p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">5. Contact Form Data</h2>
          <p>
            When you contact us via email, we collect your email address and the content of your message. This information is used solely to respond to your inquiry and is not shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">6. Third-Party Privacy Policies</h2>
          <p>
            Our Privacy Policy does not apply to other advertisers or external websites. We advise you to consult the respective Privacy Policies of third-party ad servers for more detailed information, including how to opt out of certain options.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">7. Children&apos;s Privacy (COPPA)</h2>
          <p>
            Soft Gamer does not knowingly collect any personally identifiable information from children under the age of 13. If you believe your child has provided such information on our website, please contact us immediately and we will promptly remove it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">8. CCPA Privacy Rights (California Residents)</h2>
          <p>Under the California Consumer Privacy Act (CCPA), California consumers have the right to:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li>Request disclosure of categories and specific pieces of personal data collected</li>
            <li>Request deletion of any personal data collected</li>
            <li>Opt out of the sale of personal information (Soft Gamer does not sell personal information)</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at{' '}
            <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-medium">{contactEmail}</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">9. GDPR Data Protection Rights</h2>
          <p>Every user has the following data protection rights under GDPR:</p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2">
            <li><strong className="text-[#F8FAFC]">Right to access:</strong> Request copies of your personal data.</li>
            <li><strong className="text-[#F8FAFC]">Right to rectification:</strong> Request correction of inaccurate information.</li>
            <li><strong className="text-[#F8FAFC]">Right to erasure:</strong> Request deletion of your personal data under certain conditions.</li>
            <li><strong className="text-[#F8FAFC]">Right to restrict processing:</strong> Request that we limit processing of your data.</li>
            <li><strong className="text-[#F8FAFC]">Right to data portability:</strong> Request transfer of your data to another organization or directly to you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">10. Contact Us</h2>
          <div className="mt-4 p-5 rounded-xl bg-[#111522] border border-[#272B3A] text-sm space-y-1">
            <p className="font-semibold text-[#F8FAFC]">Soft Gamer — Privacy Desk</p>
            <p>
              Email:{' '}
              <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-mono">{contactEmail}</a>
            </p>
            <p>Website: {siteUrl}</p>
          </div>
        </section>
      </div>
    </div>
  );
}
