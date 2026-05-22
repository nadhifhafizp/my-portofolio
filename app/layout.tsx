import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"], 
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Nadhif - Software & Visuals",
  description: "Full-stack Developer, IoT Enthusiast & Creative Visual Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-black text-zinc-50 antialiased selection:bg-zinc-800 selection:text-white`}>
        {children}
      </body>
    </html>
  );
}