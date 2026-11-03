import type { Metadata } from 'next';
import { Inter, Orbitron } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { SITE_CONFIG } from '@/lib/constants';
import { SITE_URL } from '@/lib/site';
import { generateWebSiteSchema, generateOrganizationSchema } from '@/lib/seo/structuredData';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.title,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Gaming News',
    'PC Gaming',
    'Console Gaming',
    'Mobile Gaming',
    'Game Guides',
    'Game Reviews',
    'Hardware Benchmarks',
    'Gaming Architecture',
  ],
  authors: [{ name: 'Soft Gamer Editorial Team' }],
  creator: 'Soft Gamer',
  publisher: 'Soft Gamer',
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Soft Gamer',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_URL}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Soft Gamer — Premium Gaming News and Editorial Magazine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [`${SITE_URL}/images/og-default.png`],
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteSchema = generateWebSiteSchema();
  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className={`${inter.variable} ${orbitron.variable}`}>
      <head>
        {/* Structured Data: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        {/* Structured Data: Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        {/* Google AdSense verification — only rendered when publisher ID is configured */}
        {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body className="flex flex-col min-h-screen bg-[#090B12] text-[#F8FAFC]">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
