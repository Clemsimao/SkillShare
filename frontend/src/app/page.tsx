'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
    'zob',
    'ouiche',
    'doudou',
    'zob',
    'ouiche',
    'doudou',
  ];

  const test = [
    'zob',
    'ouiche',
    'doudou',
  ];


  const lists = [art, health, test]; // stocke les listes à afficher
  const maxSlide = lists.length - 1;

  const nextSlide = () => setCurrentSlide((prev) => (prev === maxSlide ? 0 : prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? maxSlide : prev - 1));

  return (
    <main className="min-h-screen bg-base-100 flex flex-col items-center justify-between px-4 pt-4 pb-20">
      <Header />
        {/* Selection d'une catégorie dans la liste */}
      <div className="dropdown dropdown-bottom dropdown-center">
      <div tabIndex={0} role="button" className="btn m-1">Catégorie ⬇️</div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li><a>Art</a></li>
          <li><a>Bien être / Santé</a></li>
          <li><a>Environnement</a></li>
          <li><a>Multiculturalisme</a></li>
          <li><a>Sciences et éducation</a></li>
          <li><a>Technologie</a></li>
          <li><a>Vie Pratique</a></li>
        </ul>
      </div>

      <section className="w-full relative max-w-xl mx-auto">
        {/* Chevrons de navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Liste affichée */}
        <ul className="list-disc ml-6 pr-8 space-y-1 mb-6 transition-all duration-300">
          {lists[currentSlide].map((item, index) => (
            <li key={index} className="bg-base-200 p-2 rounded">
              {item}
            </li>
          ))}
        </ul>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </section>

      {/* Petits points indicateurs */}
      <div className="flex gap-2 mb-6">
        {lists.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-neutral' : 'bg-neutral/40'}`}
          />
        ))}
      </div>

      <Footer />
    </main>
  );
}
