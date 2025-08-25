'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0); // 0 = art, 1 = test, etc
  const art = [
    'Chant',
    'Dessin',
    'Écriture',
    'Musique',
    'Peinture',
    'Photographie',
    'Sculpture',
  ];
  const health = [
    'Activités physique et sportive',
    'Beauté et mode',
    'Bien-être mental et relaxation',
    'Nutrition',
    '',
    '',
    '',
  ];
  const test = [
    'gloups',
    'ouiche',
    'doudoudidon',
    '',
    '',
    '',
    '',
  ];

  const lists = [art, health, test]; // stocke les listes à afficher
  const maxSlide = lists.length - 1;

  // ---------- FONCTIONS DE NAVIGATION ----------
  const nextSlide = () => setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));

  // ---------- RENDU (HTML JSX) ----------
  return (
    // Structure principale avec min-h-screen et flex pour sticky footer
    <div className="min-h-screen bg-base-100 flex flex-col px-4 pt-4">
      
      <Header />

      {/* Main content qui prend tout l'espace disponible */}
      <main className="flex-1 flex flex-col items-center justify-center py-8">

        {/* ---------- DROPDOWN (menu déroulant catégories) ---------- */}
        {/* Selection d'une catégorie dans la liste */}
        <div className="dropdown dropdown-bottom dropdown-center hidden md:block mb-8">
          <div tabIndex={0} role="button" className="btn m-1 md:btn-wide">
            Choisissez une catégorie !
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 md:w-64 p-2 shadow-md"
          >
            <li><a className="text-sm md:text-base">Art</a></li>
            <li><a className="text-sm md:text-base">Bien être / Santé</a></li>
            <li><a className="text-sm md:text-base">Environnement</a></li>
            <li><a className="text-sm md:text-base">Multiculturalisme</a></li>
            <li><a className="text-sm md:text-base">Sciences et éducation</a></li>
            <li><a className="text-sm md:text-base">Technologie</a></li>
            <li><a className="text-sm md:text-base">Vie Pratique</a></li>
          </ul>
        </div>

        {/* ---------- SLIDER (la zone avec la liste des compétences) ---------- */}
        <section className="w-full relative max-w-xl mx-auto mb-8">
          {/* Chevrons de navigation */}
          <button
            onClick={prevSlide}
            className="absolute -left-4 top-2/5 btn btn-accent btn-soft btn-circle md:hidden"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          {/* Liste affichée */}
          <ul className="list-none ml-6 pr-8 space-y-1 mb-6 transition-all duration-300">
            {lists[currentSlide].map((item, index) => (
              <li key={index} className="bg-base-200 p-2 rounded">
                {item}
              </li>
            ))}
          </ul>

          <button
            onClick={nextSlide}
            className="absolute -right-2 top-2/5 btn btn-accent btn-soft btn-circle md:hidden"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </section>
        
        {/* ---------- INDICATEURS d'état (les petits points) ---------- */}
        <div className="flex gap-2">
          {lists.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-neutral' : 'bg-neutral/40'}`}
            />
          ))}
        </div>

      </main>

      <div className="pb-4">
        <Footer />
      </div>
    </div>
  );
}