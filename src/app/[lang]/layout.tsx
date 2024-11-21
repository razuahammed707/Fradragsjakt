// app/[lang]/layout.tsx  (Move from app/layout.tsx)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css'; // Update path
import { getServerSession } from 'next-auth';
import { Toaster } from 'react-hot-toast';
import Providers from '@/lib/StoreProviders';
import { getDictionary } from '@/lib/dictionary';
import { Locale, i18n } from '../../../i18n.config';
import { ClientProviders } from '../components/ClientProviders';
import { TranslationProvider } from '@/lib/TranslationProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fradragsjakt',
  description: 'Fradragsjakt is an tax saving application',
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default async function RootLayout({
  children,
  params: { lang },
}: Readonly<{
  children: React.ReactNode;
  params: { lang: Locale };
}>) {
  const session = await getServerSession();
  const dictionary = await getDictionary(lang); // Add this

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <TranslationProvider dict={dictionary}>
          <Providers>
            <ClientProviders session={session}>{children}</ClientProviders>
            <Toaster position="top-center" />
          </Providers>
        </TranslationProvider>
      </body>
    </html>
  );
}