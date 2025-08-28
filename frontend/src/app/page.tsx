'use client';

import { useState, useEffect } from 'react';
import CategoryManager from '@/components/home/CategoryManager';
import ContentPreview from '@/components/home/ContentPreview';

export default function Home() {
  // Données simulées des catégories avec leurs listes
  const categories = {
    'Art': [
      'Chant', 'Dessin', 'Écriture', 'Musique', 
      'Peinture', 'Photographie', 'Sculpture'
    ],
    'Bien être / Santé': [
      'Activités physique', 'Beauté et mode',
      'Mindset', 'Nutrition',
      'Herborisme', 'Méditation', 'Yoga et pilates'
    ],
    'Environnement': [
      'Animaux', 'Énergies vertes',
      'Éco-Jardinage', 'Upcycling',
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

  // --- Fonctions de navigation ---
  const navigateSlide = (direction: 'next' | 'prev') => {
    const newIndex = direction === 'next' 
      ? (currentSlide === maxSlide ? 0 : currentSlide + 1)
      : (currentSlide === 0 ? maxSlide : currentSlide - 1);
    
    setCurrentSlide(newIndex);
    const newCategory = categoryNames[newIndex];
    setSelectedCategory(newCategory);
    setDropdownLabel(newCategory);
  };

  const handleCategorySelect = (categoryName: keyof typeof categories) => {
    if (categories[categoryName]) {
      setSelectedCategory(categoryName);
      setDropdownLabel(categoryName);
      setCurrentSlide(categoryNames.indexOf(categoryName));
    }
  };

  return (
    <div className="px-4 pt-4">
      <div className="flex flex-col items-center justify-center py-8">
        
        {/* --- Gestionnaire de catégories --- */}
        <CategoryManager
          categories={categories}
          selectedCategory={selectedCategory}
          dropdownLabel={dropdownLabel}
          currentSlide={currentSlide}
          onCategorySelect={handleCategorySelect}
          onNavigateSlide={navigateSlide}
        />

        <ContentPreview />
        
      </div>
    </div>
  );
}