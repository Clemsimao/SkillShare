// Fichier app/layout.tsx: Layout serveur avec metadata

// --- Import NEXT.JS ---
import type { Metadata } from "next";

// --- Import Style ---
import "./globals.css"; // Styles Tailwind + DaisyUI

// --- Import Fonts ---
import { Geist, Geist_Mono, Schoolbell} from "next/font/google";

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

const schoolbell = Schoolbell({
  subsets: ['latin'],
  weight: ["400"],
});

// --- METADATA (SEO) ---
export const metadata: Metadata = {
  title: "Skill Share",
  description: "Plateforme de partage des connaissances",
};

// --- ROOT LAYOUT (Serveur) ---
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="fr"
      className={`${schoolbell.className} ${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased relative">
        {/* === FILIGRANE TAPISSERIE === */}
        <div 
          className="fixed inset-0 pointer-events-none select-none overflow-hidden"
          style={{ zIndex: 1 }}
        >
          {/* Grille de filigranes répétés avec icônes livre */}
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='70' xmlns='http://www.w3.org/2000/svg'%3E%3Cg transform='translate(43.5 33.5) rotate(-45)'%3E%3Cpath fill='none' stroke='rgba(139,69,19,0.25)' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' d='M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25' transform='scale(1.05)'/%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              backgroundSize: '60px 50px'
            }}
          />
        </div>

        {/* CONTENU DE L'APP */}
        <div className="relative z-10">
          <ClientLayout>{children}</ClientLayout>
        </div>
      </body>
    </html>
  );
}