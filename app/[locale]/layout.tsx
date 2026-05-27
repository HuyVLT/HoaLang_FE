import type { Metadata } from 'next';
import { Playfair_Display, Be_Vietnam_Pro } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { getMessages } from 'next-intl/server';
import { locales } from '@/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/sonner';
import '../globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700', '800'],
});

const beVietnam = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'HoaLang - Traditional Vietnamese Craft Villages',
  description: 'Explore the heritage, culture, and artisanal masterworks of traditional craft villages in Vietnam with AI-driven travel planners and authentic workshops.',
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: LocaleLayoutProps) {
  console.log('>>> LocaleLayout received locale:', locale);
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as (typeof locales)[number])) {
    console.warn('>>> LocaleLayout INVALID locale, calling notFound():', locale);
    notFound();
  }

  // Get messages for the provider
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${beVietnam.variable} ${playfair.variable}`}>
      <body className="bg-background text-foreground antialiased min-h-screen relative font-sans">
        
        {/* Subtle background organic grain layer */}
        <div className="fixed inset-0 pointer-events-none bg-grain z-0 opacity-80" />
        
        <NextIntlClientProvider locale={locale} messages={messages}>
          <div className="relative z-10 flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster richColors closeButton position="top-right" />
        </NextIntlClientProvider>

      </body>
    </html>
  );
}
