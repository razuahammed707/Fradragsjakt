// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getServerSession } from 'next-auth';
import { ClientProviders } from './components/ClientProviders';
import { Toaster } from 'react-hot-toast';
import Providers from '@/lib/StoreProviders';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fradragsjakt',
  description: 'Fradragsjakt is an tax saving application',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <ClientProviders session={session}>{children}</ClientProviders>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  );
}
