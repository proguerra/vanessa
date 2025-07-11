
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from '@/components/layout/GoogleAnalytics';

export const metadata: Metadata = {
  title: 'Viva La Beauty - Waxing & Beauty Services in Sugar Land, TX',
  description: 'Expert waxing and beauty services at Viva La Beauty in Sugar Land, Texas. Book your appointment today!',
  keywords: 'waxing Sugar Land, beauty services Sugar Land, Viva La Beauty, brazilian wax, eyebrow waxing, facials',
  openGraph: {
    title: 'Viva La Beauty - Waxing & Beauty Services in Sugar Land, TX',
    description: 'Expert waxing and beauty services at Viva La Beauty in Sugar Land, Texas. Book your appointment today!',
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://vivalabeauty.com',
    siteName: 'Viva La Beauty',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen" suppressHydrationWarning={true}>
        <GoogleAnalytics />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
