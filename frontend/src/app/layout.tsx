'use client';

// ----------- IMPORTS NEXT.JS -----------
import type { Metadata } from "next";

// ----------- IMPORTS STYLES -----------
import "./globals.css"; // Styles Tailwind + DaisyUI

// ----------- IMPORTS FONTS -----------
import { Geist, Geist_Mono } from "next/font/google";

// ----------- IMPORTS COMPOSANTS -----------
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { use } from "react";

// ----------- CONFIG FONTS -----------
const geistSans = Geist({
  variable: "--font-geist-sans",  
  subsets: ["latin"],             
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ----------- METADATA (SEO) -----------
export const metadata: Metadata = {
  title: "Skill Share",            
  description: "Plateforme de partage des connaissances",  
};

// ----------- ROOT LAYOUT -----------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-base-100 flex flex-col">
          <Header />
          
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
        </div>
      </body>
    </html>
  );
}