import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: "Nadhif - Portfolio",
  description: "Full-stack Developer, IoT Enthusiast & Creative Visual Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      {/* Warna dasar krem terang yang elegan */}
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-stone-50 text-stone-800 antialiased`}>
        {children}
      </body>
    </html>
  );
}