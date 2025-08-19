'use client';

import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const skills = [
    'Communication',
    'Programmation',
    'Graphisme',
    'Gestion de projet',
    'Photographie',
    'Écriture',
    'Marketing',
    'Musique'
  ];

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

      {/* Liste de compétences */}
      <section className="w-full relative">
        <h2 className="text-xl font-semibold mb-2 text-center">Liste des compétences</h2>

        {/* Navigation Gauche */}
        <button className="absolute left-0 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Compétences */}
        <ul className="list-disc ml-6 pr-8 space-y-1 mb-6">
          {skills.map((skill, index) => (
            <li key={index} className="bg-base-200 p-2 rounded">
              {skill}
            </li>
          ))}
        </ul>

        {/* Navigation Droite */}
        <button className="absolute right-0 top-1/2 -translate-y-1/2 btn btn-ghost btn-circle">
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </section>

      {/* Barre d'état */}
      <div className="flex gap-2 mb-6">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${i === 1 ? 'bg-neutral' : 'bg-neutral/40'}`}
          />
        ))}
      </div>  
      
      <Footer />
    </main>
  );
}
