import type { Metadata } from "next";
import { Jost } from 'next/font/google';
import "./globals.css";

const jostFont = Jost({
    variable: '--font-jost',
    subsets: ['latin', 'cyrillic'],
    weight: ['400'],
});

export const metadata: Metadata = {
    title: 'Internet shop Next',
    description: 'Internet shop Next',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${jostFont.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
