// components/Footer.tsx

// Importer le composant Link de Next.js pour les liens internes
import Link from "next/link";

// Icônes Lucide 
import { Twitter, Youtube, Facebook, Instagram } from "lucide-react";

// Composant footer
export default function Footer() {
  return (
    <footer className="footer sm:footer-horizontal bg-neutral text-neutral-content p-10">
      {/* Bloc branding */}
      <aside>
        <span className="text-lg font-bold">SkillShare.</span>
        <p className="text-sm opacity-80">
          Plateforme de partage des connaissance
        </p>
      </aside>

      {/* Bloc social */}
      <nav>
        <h6 className="footer-title">Suivez-nous sur les réseaux:</h6>
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://twitter.com"
            aria-label="X / Twitter"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com"
            aria-label="Instagram"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <Instagram className="w-5 h-5" />
          </a>
          <a
            href="https://youtube.com"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <Youtube className="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com"
            aria-label="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary"
          >
            <Facebook className="w-5 h-5" />
          </a>
        </div>
      </nav>
    </footer>
  );
}
