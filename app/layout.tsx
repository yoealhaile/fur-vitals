import type { Metadata } from "next";
import { Quicksand } from 'next/font/google';
import { AppProvider } from '@/context/AppContext';
import "./globals.css";

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FurVitals - Your Dog's Health BFF",
  description: "Playful health tracking for happy, healthy pups",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={quicksand.variable}>
      <body className={`${quicksand.className} antialiased font-rounded`} style={{ backgroundColor: '#F0FDFA' }}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
