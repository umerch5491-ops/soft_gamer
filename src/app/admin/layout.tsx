import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth/authContext';

export const metadata: Metadata = {
  title: 'Admin Dashboard — Soft Gamer CMS',
  description: 'Editorial article management and content publishing interface for Soft Gamer.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}

