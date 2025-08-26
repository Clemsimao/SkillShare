'use client';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

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

  // Éléments du dropdown
  const renderDropdownItems = () => (
    <>
      {/* Catégories actives */}
      {['Art', 'Bien être / Santé', 'Environnement'].map(category => (
        <li key={category}>
          <a
            className="text-sm md:text-base cursor-pointer font-schoolbell"
            onClick={() => onCategorySelect(category)}
          >
            {category}
          </a>
        </li>
      ))}

      {/* Catégories inactives */}
      {['Multiculturalisme', 'Sciences et éducation', 'Technologie', 'Vie Pratique'].map(category => (
        <li key={category}>
          <a className="text-sm md:text-base opacity-50 cursor-not-allowed font-schoolbell">
            {category}
          </a>
        </li>
      ))}
    </>
  );

  // Page d'accueil avant sélection
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
        <p className="text-sm text-base-content/60 font-schoolbell">
          Sélectionnez une catégorie ci-dessus
        </p>
      </div>
    </section>
  );

  // Section avec liste des compétences
  const renderCategorySection = () => (
    <section className="w-full relative max-w-xl mx-auto mb-8">
      {/* Titre de la catégorie actuelle (mobile) */}
      <div className="flex justify-center mb-4 md:hidden">
        <h2 className="btn btn-accent pointer-events-none text-center w-50 font-schoolbell">
          {selectedCategory}
        </h2>
      </div>

      {/* Navigation mobile "Swipe" */}
      <button
        onClick={() => onNavigateSlide('prev')}  // <-- Correction ici
        className="absolute -left-4 top-2/5 btn btn-accent btn-soft btn-circle md:hidden"
        aria-label="Catégorie précédente"
      >
        <ChevronLeftIcon className="w-6 h-6" />
      </button>
      <button
        onClick={() => onNavigateSlide('next')}  // <-- Correction ici
        className="absolute -right-2 top-2/5 btn btn-accent btn-soft btn-circle md:hidden"
        aria-label="Catégorie suivante"
      >
        <ChevronRightIcon className="w-6 h-6" />
      </button>

      {/* Liste des compétences */}
      <ul className="list-none ml-6 pr-8 space-y-1 mb-6 transition-all duration-500 ease-in-out">
        {selectedCategory && categories[selectedCategory]?.map((item, index) => (
          <li key={index} className="bg-base-200 p-2 rounded hover:bg-base-300">
            <span className="font-schoolbell">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
  <>
    {/* --- Dropdown (desktop) --- */}
    <div className="dropdown dropdown-bottom dropdown-center hidden md:block mb-8">
      <div tabIndex={0} role="button" className="btn btn-accent btn-soft m-1 md:btn-wide font-schoolbell">
        {dropdownLabel}
      </div>
      <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-1 w-72 md:w-64 p-2 shadow-md">
        {renderDropdownItems()}
      </ul>
    </div>

    {/* --- Contenu principal --- */}
    {selectedCategory ? renderCategorySection() : renderWelcomeSection()}

    {/* --- Indicateurs de navigation (petits points mobile) --- */}
    {selectedCategory && (
      <div className="flex gap-2 mb-8 md:hidden">
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
  </>
);