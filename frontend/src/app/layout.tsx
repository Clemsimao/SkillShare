// Fichier app/layout.tsx: Layout serveur avec metadata

// --- Import NEXT.JS ---
import type { Metadata } from "next";

// --- Import Style ---
import "./globals.css"; // Styles Tailwind + DaisyUI

// --- Import Fonts ---
import { Geist, Geist_Mono } from "next/font/google";

// --- Import Components ---
import ClientLayout from "@/components/ClientLayout";
// Ca permet d'utiliser des composants client dans le layout serveur [FF]

// --- CONFIG FONTS ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- METADATA (SEO) ---
export const metadata: Metadata = {
  title: "Skill Share",
  description: "Plateforme de partage des connaissances",
};

// --- ROOT LAYOUT (Serveur) ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}