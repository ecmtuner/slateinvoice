import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import SessionProvider from '@/components/SessionProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SlateInvoice — Simple Invoicing for Everyone',
  description: 'Create professional invoices, estimates, and receipts in seconds. Free plan available.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18018950552"
          strategy="afterInteractive"
        />
        <Script id="google-ads-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18018950552');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-gray-950 text-white antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
