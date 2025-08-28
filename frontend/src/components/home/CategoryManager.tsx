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
  categories, selectedCategory, dropdownLabel, currentSlide, onCategorySelect, onNavigateSlide
}: CategoryManagerProps) {
  const categoryNames = Object.keys(categories);
  const activeCategories = ['Art', 'Bien être / Santé', 'Environnement'];
  const inactiveCategories = ['Multiculturalisme', 'Sciences et éducation', 'Technologie', 'Vie Pratique'];
  const ACCENT = "#19362D";

  // Éléments du dropdown
  const renderDropdownItems = () => (
    <>
      {/* Catégories actives */}
      {activeCategories.map(category => (
        <li key={category}>
          <a className="text-sm md:text-base cursor-pointer font-schoolbell" onClick={() => onCategorySelect(category)}>
            {category}
          </a>
        </li>
      ))}
      {/* Catégories inactives */}
      {inactiveCategories.map(category => (
        <li key={category}>
          <a className="text-sm md:text-base opacity-50 cursor-not-allowed font-schoolbell">{category}</a>
        </li>
      ))}
    </>
  );

  // SVG de bienvenue
  const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-20 h-50 mx-auto mb-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );

  // Composant SVG réutilisable
  const SideImage = ({ src, alt, side }: { src: string; alt: string; side: 'left' | 'right' }) => (
    <div className="hidden md:flex flex-shrink-0 m-4 bg-base-200 p-4 rounded-lg">
      <Image src={src} alt={alt} width={300} height={300} className="text-accent" />
    </div>
  );

  // Contenu central partagé
  const CentralContent = ({ children }: { children: React.ReactNode }) => (
    <div className="flex-1 max-w-sm mx-auto px-8 md:px-0">{children}</div>
  );

  // Section avec SVG layout
  const SectionWithSVG = ({ children, maxWidth = "max-w-5xl" }: { children: React.ReactNode; maxWidth?: string }) => (
    <section className={`w-full relative ${maxWidth} mx-auto mb-8 flex items-end`}>
      <SideImage src="/collab.svg" alt="deux personnes collaborant" side="left" />
      {children}
      <SideImage src="/learn.svg" alt="Une personne en train d'apprendre en suivant un cours en ligne" side="right" />
    </section>
  );

  // Page d'accueil avant sélection
  const renderWelcomeSection = () => (
    <SectionWithSVG>
      <div className="flex-1 max-w-xl mx-auto text-center">
        <div className="bg-base-200 p-8 rounded-lg">
          <BookIcon />
          <p className="text-md text-base-content/60 font-schoolbell">Sélectionnez une catégorie ci-dessus</p>
        </div>
      </div>
    </SectionWithSVG>
  );

  // Section avec liste des compétences
  const renderCategorySection = () => (
    <SectionWithSVG>
      <CentralContent>
        {/* Titre de la catégorie actuelle (mobile) */}
        <div className="flex justify-center mb-4 md:hidden ml-6 pr-8">
          <h2 className="btn btn-accent pointer-events-none text-center w-full font-schoolbell">
            {selectedCategory}
          </h2>
        </div>

        {/* Navigation mobile "Swipe" */}
        <button onClick={() => onNavigateSlide('prev')} className="absolute -left-4 top-2/5 btn btn-accent btn-soft btn-circle md:hidden z-10" aria-label="Catégorie précédente">
          <ChevronLeftIcon className="w-6 h-6" />
        </button>
        <button onClick={() => onNavigateSlide('next')} className="absolute -right-2 top-2/5 btn btn-accent btn-soft btn-circle md:hidden z-10" aria-label="Catégorie suivante">
          <ChevronRightIcon className="w-6 h-6" />
        </button>

        {/* Liste des compétences */}
        <ul className="list-none ml-6 pr-8 md:ml-0 md:pr-0 space-y-1 mb-6 transition-all duration-500 ease-in-out">
          {selectedCategory && categories[selectedCategory]?.map((item, index) => (
            <li key={index} className="bg-base-200 p-2 rounded hover:bg-base-300">
              <span className="font-schoolbell">{item}</span>
            </li>
          ))}
        </ul>
      </CentralContent>
    </SectionWithSVG>
  );

  return (
    <>
      {/* --- Conteneur harmonisé avec ContentPreview --- */}
      <section className="w-full max-w-5xl mx-auto px-4">
        <div className="rounded-xl bg-base-200 shadow-lg p-4 mb-4 border h-110" style={{ borderColor: ACCENT }}>
          
          {/* --- Dropdown (desktop) --- */}
          <div className="dropdown dropdown-bottom dropdown-center hidden md:block mb-8 w-full max-w-sm mx-auto">
            <div tabIndex={0} role="button" className="btn btn-accent btn-soft w-full font-schoolbell">{dropdownLabel}</div>
            <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-full p-2 shadow-md">
              {renderDropdownItems()}
            </ul>
          </div>

          {/* --- Contenu principal --- */}
          {selectedCategory ? renderCategorySection() : renderWelcomeSection()}

          {/* --- Indicateurs de navigation (petits points mobile) --- */}
          {selectedCategory && (
            <div className="flex gap-2 mb-8 md:hidden justify-center">
              {categoryNames.map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-neutral' : 'bg-neutral/40'}`} />
              ))}
            </div>
          )}
          
        </div>
      </section>
    </>
  );
}