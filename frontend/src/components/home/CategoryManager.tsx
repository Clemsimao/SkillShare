'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import Image from 'next/image';

type CategoryManagerProps = {
  categories: Record<string, string[]>;
  selectedCategory: string | null;
  dropdownLabel: string;
  currentSlide: number;
  onCategorySelect: (category: string) => void;
  onNavigateSlide: (direction: 'next' | 'prev') => void;
};

export default function CategoryManager({
  categories,
  selectedCategory,
  dropdownLabel,
  currentSlide,
  onCategorySelect,
  onNavigateSlide
}: CategoryManagerProps) {
  const categoryNames = Object.keys(categories);
  const activeCategories = ['Art', 'Bien être / Santé', 'Environnement'];
  const inactiveCategories = ['Multiculturalisme', 'Sciences et éducation', 'Technologie', 'Vie Pratique'];
  const ACCENT = "#19362D";

  // Icône flèche réutilisable
  const ArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm4.28 10.28a.75.75 0 0 0 0-1.06l-3-3a.75.75 0 1 0-1.06 1.06l1.72 1.72H8.25a.75.75 0 0 0 0 1.5h5.69l-1.72 1.72a.75.75 0 1 0 1.06 1.06l3-3Z" clipRule="evenodd" />
    </svg>
  );

  // --- Éléments du dropdown ---
  const renderDropdownItems = () => (
    <>
      {/* Catégories actives */}
      {activeCategories.map(category => (
        <li key={category}>
          <a 
            className="text-sm md:text-base cursor-pointer font-schoolbell flex items-center gap-2" 
            onClick={() => onCategorySelect(category)}
          >
            <ArrowIcon />
            {category}
          </a>
        </li>
      ))}
      
      {/* Catégories inactives */}
      {inactiveCategories.map(category => (
        <li key={category}>
          <a className="text-sm md:text-base opacity-50 cursor-not-allowed font-schoolbell flex items-center gap-2">
            <ArrowIcon />
            {category}
          </a>
        </li>
      ))}
    </>
  );

  // Icône si pas de catégorie sélectionnée
  const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-20 mx-auto mb-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );

  // Images latérales (desktop uniquement)
  const SideImage = ({ src, alt, side }: { src: string; alt: string; side: 'left' | 'right' }) => (
    <div className={`hidden md:flex flex-shrink-0 m-4 bg-base-200 p-4 rounded-lg sticky top-20 ${side === 'left' ? 'left-0' : 'right-0'}`}>
      <Image src={src} alt={alt} width={300} height={300} className="text-accent" />
    </div>
  );

  // Config images latérales
  const SectionWithImages = ({ children }: { children: React.ReactNode }) => (
    <section className="w-full relative max-w-5xl mx-auto mb-8 flex items-start">
      <SideImage src="/collab.svg" alt="deux personnes collaborant" side="left" />
      {children}
      <SideImage src="/learn.svg" alt="Une personne en train d'apprendre en suivant un cours en ligne" side="right" />
    </section>
  );

  // Page d'accueil avant sélection
  const renderWelcomeSection = () => (
    <SectionWithImages>
      <div className="flex-1 max-w-xl mx-auto text-center">
        <div className="bg-base-200 p-8 rounded-lg">
          <BookIcon />
          <p className="text-md text-base-content/60 font-schoolbell">
            Sélectionnez une catégorie ci-dessus
          </p>
        </div>
      </div>
    </SectionWithImages>
  );

  // Section avec liste des compétences
  const renderCategorySection = () => (
    <SectionWithImages>
      <div className="flex-1 max-w-sm mx-auto px-8 md:px-0">
        {/* Titre de la catégorie (mobile uniquement) */}
        <div className="flex justify-center mb-4 md:hidden ml-6 pr-4">
          <h2 className="btn btn-accent pointer-events-none text-center w-full font-schoolbell">
            {selectedCategory}
          </h2>
        </div>

        {/* Boutons de navigation mobile */}
        <button 
          onClick={() => onNavigateSlide('prev')} 
          className="absolute -left-2 -bottom-14 btn btn-accent btn-soft btn-circle md:hidden z-10" 
          aria-label="Catégorie précédente"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => onNavigateSlide('next')} 
          className="absolute -right-2 -bottom-14 btn btn-accent btn-soft btn-circle md:hidden z-10" 
          aria-label="Catégorie suivante"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* --- Liste des compétences --- */}
        <ul className="list-none ml-6 pr-8 md:ml-0 md:pr-0 space-y-1 mb-6 transition-all duration-500 ease-in-out">
          {selectedCategory && categories[selectedCategory]?.map((item, index) => (
            <li key={index} className="bg-base-200 p-2 rounded hover:bg-base-300 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span className="font-schoolbell">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionWithImages>
  );

  return (
    <>
      {/* -- Version desktop -- */}
      <section className="w-full max-w-5xl mx-auto px-4">
        <div className="hidden md:block rounded-xl bg-base-200 shadow-lg p-4 mb-4">
          {/* Dropdown desktop */}
          <div className="flex justify-center mb-8">
            <div className="dropdown dropdown-bottom dropdown-center w-full max-w-sm">
              <div tabIndex={0} role="button" className="btn btn-accent btn-soft w-full font-schoolbell">
                {dropdownLabel}
              </div>
              <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-80 p-2 shadow-md">
                {renderDropdownItems()}
              </ul>
            </div>
          </div>
          {/* Contenu principal */}
          {selectedCategory ? renderCategorySection() : renderWelcomeSection()}
        </div>
        
        {/* -- Version mobile -- */}
        <div className="md:hidden rounded-xl bg-base-200 shadow-lg p-4 mb-4 ">
          {/* Contenu principal */}
          {selectedCategory ? renderCategorySection() : renderWelcomeSection()}

          {/* Indicateurs navigation (les gros points) */}
          {selectedCategory && (
            <div className="flex gap-2 mb-4 justify-center">
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
        </div>
      </section>
    </>
  );
}