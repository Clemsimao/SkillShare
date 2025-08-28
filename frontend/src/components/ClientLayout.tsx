'use client';

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

// components/ClientLayout.tsx
import { PropsWithChildren } from "react";

export default function ClientLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-base-100 max-w-7xl mx-auto flex flex-col">
      <div className="px-6 pt-6"> {/* Padding pour Header */}
        <Header />
      </div>
      
      <main className="flex-1 px-6"> {/* Padding pour contenu */}
        {children}
      </main>
      
      <div className="px-6 pb-6"> {/* Padding pour Footer */}
        <Footer />
      </div>
    </div>
  );
}