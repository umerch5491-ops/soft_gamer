import { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/site';

export const metadata: Metadata = buildPageMetadata({
  title: 'Contact Us — Soft Gamer Editorial & Inquiries',
  description: 'Get in touch with the Soft Gamer editorial and publishing team. Send your news tips, game review codes, inquiries, or feedback.',
  path: '/contact',
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

