'use client'

import { useState, useEffect } from 'react'
import CategoryManager from '@/components/home/CategoryManager'
import ContentPreview from '@/components/home/ContentPreview'

import { useSkills } from '@/integration/hooks/use-skills'

export default function Home() {

  const { categories } = useSkills()

  // États pour gérer la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categories | null>(null)
  const [dropdownLabel, setDropdownLabel] = useState('Choisissez une catégorie !')
  const [currentSlide, setCurrentSlide] = useState(0)

  const isMobile = () => (window.innerWidth < 768)
  const [mobile, setMobile] = useState(isMobile())

  window.addEventListener('resize', () => {
    setMobile(isMobile())
  })

  // --- Fonctions de navigation ---
  const navigateSlide = (direction: 'next' | 'prev') => {
    const maxSlide = categories.length - 1

    let newIndex;

    if (direction === 'next') {
      if (currentSlide === maxSlide) {
        newIndex = 0
      }
      else {
        newIndex = currentSlide + 1
      }
    }
    else { // if (direction === 'prev')
      if (currentSlide === 0) {
        newIndex = maxSlide
      }
      else {
        newIndex = currentSlide - 1
      }
    }

    setCurrentSlide(newIndex)
  
    const newCategory = categories[newIndex]
    setSelectedCategory(newCategory)
    setDropdownLabel(newCategory.title)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setDropdownLabel(category.title)
    setCurrentSlide(categories.indexOf(category))

    document.activeElement.blur()
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex flex-col items-center justify-center py-8">

        {/* --- Gestionnaire de catégories --- */}
        <CategoryManager
          categories={categories}
          selectedCategory={selectedCategory || (mobile ? categories[0] : null)}
          dropdownLabel={dropdownLabel}
          currentSlide={currentSlide}
          onCategorySelect={handleCategorySelect}
          onNavigateSlide={navigateSlide}
        />

        <ContentPreview />

      </div>
    </div>
  )
}