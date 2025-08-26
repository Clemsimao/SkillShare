'use client';

import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ContentPreview from '@/components/home/contentPreview';

export default function Home() {
  // Données simulées des catégories avec leurs listes
  const categories = {
    'Art': [
      'Chant', 'Dessin', 'Écriture', 'Musique',
      'Peinture', 'Photographie', 'Sculpture'
    ],
    'Bien être / Santé': [
      'Activités physique et sportive', 'Beauté et mode',
      'Bien-être mental et relaxation', 'Nutrition',
      'Massage et thérapies', 'Méditation', 'Yoga et pilates'
    ],
    'Environnement': [
      'Agriculture durable', 'Énergies renouvelables',
      'Jardinage écologique', 'Recyclage et upcycling',
      'Zéro déchet', 'Permaculture', 'Éco-construction'
    ]
  };

  // États pour gérer la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories | null>(null);
  const [dropdownLabel, setDropdownLabel] = useState('Choisissez une catégorie !');
  const [currentSlide, setCurrentSlide] = useState(0);

  const categoryNames = Object.keys(categories) as (keyof typeof categories)[];
  const maxSlide = categoryNames.length - 1;

  // --- Fonction de détection de la taille d'écran et initialisation ---
  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      
      // Pour éviter d'avoir une liste vide sur mobile
      if (mobile && selectedCategory === null) {
        setSelectedCategory('Art');
      }
      // Si on passe en desktop et qu'Art était sélectionné par défaut
      else if (!mobile && selectedCategory === 'Art') {
        // Optionnel : remettre à null pour forcer la sélection
        // setSelectedCategory(null);
        // setDropdownLabel('Choisissez une catégorie !');
      }
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [selectedCategory]);

  // --- Fonctions de navigation "Swipe" ---
  const navigateSlide = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentSlide === maxSlide ? 0 : currentSlide + 1)
      : (currentSlide === 0 ? maxSlide : currentSlide - 1);
    
    setCurrentSlide(newIndex);
    const newCategory = categoryNames[newIndex];
    setSelectedCategory(newCategory);
    setDropdownLabel(newCategory);
  };

  // --- Fonctions de navigation "Dropdown" ---
  const handleCategorySelect = (categoryName: keyof typeof categories) => {
    if (categories[categoryName]) {
      setSelectedCategory(categoryName);
      setDropdownLabel(categoryName);
      setCurrentSlide(categoryNames.indexOf(categoryName));
    }
  };

  // --- éléments du dropdown ---
  const renderDropdownItems = () => (
    <>
      {/* Catégories actives */}
      {['Art', 'Bien être / Santé', 'Environnement'].map(category => (
        <li key={category}>
          <a 
            className="text-sm md:text-base cursor-pointer" 
            onClick={() => handleCategorySelect(category as keyof typeof categories)}
          >
            {category}
          </a>
        </li>
      ))}
      
      {/* Catégories inactives */}
      {['Multiculturalisme', 'Sciences et éducation', 'Technologie', 'Vie Pratique'].map(category => (
        <li key={category}>
          <a className="text-sm md:text-base opacity-50 cursor-not-allowed">
            {category}
          </a>
        </li>
      ))}
    </>
  );

  // Page d'accueil avant sélection (desktop uniquement)
  const renderWelcomeSection = () => (
    <section className="w-full max-w-xl mx-auto mb-8 text-center">
      <div className="bg-base-200 p-8 rounded-lg">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="w-20 h-20 mx-auto mb-4"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" 
          />
        </svg>
        <p className="text-sm text-base-content/60">
          Sélectionnez une catégorie ci-dessus
        </p>
      </div>
    </section>
  );

  // --- Section principale avec liste des compétences ---
  const renderCategorySection = () => (
    <section className="w-full relative max-w-xl mx-auto mb-8">
      {/* Titre de la catégorie actuelle (visible mais inactive sur mobile) */}
      <div className="flex justify-center mb-4 md:hidden">
        <h2 className="btn btn-accent pointer-events-none text-center w-50">
          {selectedCategory}
        </h2>
      </div>

      {/* Navigation mobile "Swipe" */}
      <button
        onClick={() => navigateSlide('prev')}
        className="absolute -left-4 top-2/5 btn btn-accent btn-soft btn-circle md:hidden"
        aria-label="Catégorie précédente"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>

      <button
        onClick={() => navigateSlide('next')}
        className="absolute -right-2 top-2/5 btn btn-accent btn-soft btn-circle md:hidden"
        aria-label="Catégorie suivante"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Liste des compétences */}
      <ul className="list-none ml-6 pr-8 space-y-1 mb-6 transition-all duration-300">
        {selectedCategory && categories[selectedCategory].map((item, index) => (
          <li key={index} className="bg-base-200 p-2 rounded">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="px-4 pt-4">
      <div className="flex flex-col items-center justify-center py-8">
        {/* --- Dropdown --- */}
        <div className="dropdown dropdown-bottom dropdown-center hidden md:block mb-8">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-accent btn-soft m-1 md:btn-wide"
          >
            {dropdownLabel}
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 md:w-64 p-2 shadow-md"
          >
            {renderDropdownItems()}
          </ul>
        </div>

        {/* --- Contenu principal --- */}
        {selectedCategory ? renderCategorySection() : renderWelcomeSection()}
        
        {/* --- Indicateur de navigation (les petits points) --- */}
        {selectedCategory && (
          <div className="flex gap-2 mb-8">
            {categoryNames.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i === currentSlide ? 'bg-neutral' : 'bg-neutral/40'
                }`}
              />
            ))}
          </div>
        )}

        {/* --- ContentPreview intégré --- */}
        <ContentPreview />
      </div>
    </div>
  );
}