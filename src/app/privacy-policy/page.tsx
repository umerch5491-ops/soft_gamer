import { Metadata } from 'next';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Privacy Policy — Soft Gamer',
  description: 'Soft Gamer privacy policy: learn how we collect, use, and protect your information, including cookies, analytics, and advertising disclosures.',
};

export default function PrivacyPolicyPage() {
  const contactEmail = 'umerjamil126@gmail.com';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} />

      <header className="mb-10 pb-6 border-b border-[#272B3A]">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm text-[#A1A1AA]">
          Last Updated: November 2026
        </p>
      </header>

      <div className="space-y-8 text-[#A1A1AA] leading-relaxed text-base sm:text-lg">
        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">1. Introduction</h2>
          <p>
            At <strong className="text-[#F8FAFC]">Soft Gamer</strong> (accessible at softgamer.dev), the privacy of our visitors is one of our primary priorities. This Privacy Policy document outlines the types of information that is collected and recorded by Soft Gamer and how we use it.
          </p>
          <p className="mt-3">
            If you have additional questions or require more information about our Privacy Policy, please contact us via email at{' '}
            <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-medium">
              {contactEmail}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">2. Log Files &amp; Technical Diagnostics</h2>
          <p>
            Soft Gamer follows a standard procedure of utilizing log files. These files log visitors when they access websites. All hosting and content delivery network (CDN) services do this as part of infrastructure security and hosting analytics.
          </p>
          <p className="mt-3">
            The information collected by log files includes:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li>Internet Protocol (IP) addresses</li>
            <li>Browser type and operating system version</li>
            <li>Internet Service Provider (ISP)</li>
            <li>Date and time stamps</li>
            <li>Referring and exit pages</li>
            <li>Number of clicks and navigational paths</li>
          </ul>
          <p className="mt-3">
            This information is not linked to any information that is personally identifiable. The purpose of this data is to analyze trends, administer the site, prevent malicious attacks, and improve overall performance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">3. Cookies and Web Beacons</h2>
          <p>
            Like any modern website, Soft Gamer uses &quot;cookies&quot;. These cookies are used to store information including visitors&apos; preferences and the pages on the website that the visitor accessed or visited. The information is used to optimize user experience by customizing web page content based on browser type or other technical attributes.
          </p>
          <p className="mt-3">
            You can choose to disable cookies through your individual browser options. Detailed information about cookie management with specific web browsers can be found at the browsers&apos; respective websites.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">4. Google DoubleClick DART Cookies &amp; Advertising Partners</h2>
          <p>
            Google is a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to softgamer.dev and other sites on the internet.
          </p>
          <p className="mt-3">
            Visitors may choose to decline the use of DART cookies by visiting the Google Ad and Content Network Privacy Policy at:{' '}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#38BDF8] hover:underline break-all"
            >
              https://policies.google.com/technologies/ads
            </a>
          </p>
          <p className="mt-3">
            Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are sent directly to users&apos; browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.
          </p>
          <p className="mt-3">
            Please note that Soft Gamer has no access to or control over these cookies that are used by third-party advertisers.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">5. Third-Party Privacy Policies</h2>
          <p>
            Soft Gamer&apos;s Privacy Policy does not apply to other advertisers or external websites. We advise you to consult the respective Privacy Policies of these third-party ad servers or platforms for more detailed information, including instructions on how to opt out of certain practices.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">6. CCPA Privacy Rights (Do Not Sell My Personal Information)</h2>
          <p>
            Under the California Consumer Privacy Act (CCPA), California consumers have the right to:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li>Request disclosure of categories and specific pieces of personal data collected.</li>
            <li>Request deletion of any personal data collected about the consumer.</li>
            <li>Opt out of the sale of personal information. (Soft Gamer does not sell personal information).</li>
          </ul>
          <p className="mt-3">
            If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at{' '}
            <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-medium">
              {contactEmail}
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">7. GDPR Data Protection Rights</h2>
          <p>
            We ensure you are fully aware of all of your data protection rights under the General Data Protection Regulation (GDPR). Every user is entitled to the following:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 mt-2 text-[#A1A1AA]">
            <li><strong className="text-[#F8FAFC]">The right to access:</strong> You have the right to request copies of your personal data.</li>
            <li><strong className="text-[#F8FAFC]">The right to rectification:</strong> You have the right to request correction of any information you believe is inaccurate.</li>
            <li><strong className="text-[#F8FAFC]">The right to erasure:</strong> You have the right to request that we erase your personal data under certain conditions.</li>
            <li><strong className="text-[#F8FAFC]">The right to restrict processing:</strong> You have the right to request that we restrict processing of your personal data.</li>
            <li><strong className="text-[#F8FAFC]">The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">8. Children&apos;s Information (COPPA)</h2>
          <p>
            Another priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity.
          </p>
          <p className="mt-3">
            Soft Gamer does not knowingly collect any Personal Identifiable Information from children under the age of 13. If you believe that your child provided this kind of information on our website, we strongly encourage you to contact us immediately and we will do our best efforts to promptly remove such information from our records.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">9. Contact Us</h2>
          <p>
            For any questions, concerns, or requests regarding this Privacy Policy, please reach out to us at:
          </p>
          <div className="mt-4 p-5 rounded-xl bg-[#111522] border border-[#272B3A] text-sm space-y-1">
            <p className="font-semibold text-[#F8FAFC]">Soft Gamer Editorial &amp; Privacy Desk</p>
            <p>
              Email:{' '}
              <a href={`mailto:${contactEmail}`} className="text-[#38BDF8] hover:underline font-mono">
                {contactEmail}
              </a>
            </p>
            <p>Website: softgamer.dev</p>
          </div>
        </section>
      </div>
    </div>
  );
}
