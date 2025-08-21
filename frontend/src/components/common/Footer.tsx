import Link from "next/link";
import { Twitter, Youtube, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "X / Twitter" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  ];

  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-center text-center sm:text-left">
        {/* Branding (centré en mobile) */}
        <div className="mb-6 sm:mb-0">
          <p className="text-lg font-bold">
            SKILLSHARE <span className="text-sm">© All rights reserved</span>
          </p>
          <p className="text-sm opacity-70">Plateforme de partage des connaissances</p>
        </div>

        {/* Réseaux sociaux (centré en mobile) */}
        <div className="text-center sm:text-right">
          <h6 className="footer-title">Suivez-nous sur les réseaux:</h6>
          <div className="flex gap-4 justify-center sm:justify-end mt-2">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
