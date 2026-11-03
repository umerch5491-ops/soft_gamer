import { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Contact Us — Soft Gamer',
  description: 'Get in touch with the Soft Gamer editorial and publishing team. Send your news tips, game review codes, inquiries, or feedback.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact Us — Soft Gamer',
    description: 'Get in touch with the Soft Gamer editorial and publishing team.',
    url: `${SITE_URL}/contact`,
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

