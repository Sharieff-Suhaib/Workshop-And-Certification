import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Workshop & Certification Platform',
  description: 'Register for workshops and earn certificates',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}