'use client';
import Link from "next/link";
import { Twitter, Youtube, Facebook, Instagram } from "lucide-react";
import FormContactModal from "@/components/contact/FormContactModal";

export default function Footer() {
  const socialLinks = [
    { href: "https://twitter.com", icon: Twitter, label: "X / Twitter" },
    { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
    { href: "https://youtube.com", icon: Youtube, label: "YouTube" },
    { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
  ];

  const openContactModal = () => {
    const dialog = document.getElementById('formcontact_modal') as HTMLDialogElement | null;
    dialog?.showModal();
  };

  return (
    <footer className="footer bg-neutral text-neutral-content p-10">
      <div className="w-full flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
        
        {/* Section branding */}
        <div className="mb-6 sm:mb-0">
          <p className="text-lg font-bold">
            SKILLSHARE <span className="text-sm">© All rights reserved</span>
          </p>
          <p className="text-sm opacity-70">Plateforme de partage des connaissances</p>
          <button
            onClick={openContactModal}
            className="mt-2 flex text-sm hover:text-primary transition-colors items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>

            Contactez-nous
          </button>
        </div>

        {/* Section réseaux sociaux */}
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
                className="hover:text-primary transition-colors"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <FormContactModal /> 
    </footer>
  );
}