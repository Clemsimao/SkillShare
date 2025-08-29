'use client'
import { useState, useEffect } from 'react'
import CategoryManager from '@/components/home/CategoryManager'
import ContentPreview from '@/components/home/ContentPreview'
import { getCategories, getLandingTutorial, getExampleProfiles } from '@/integration/services/public'
import { getToken } from '@/integration/lib/token'

export default function Home() {
  // États pour les données API
  const [categories, setCategories] = useState([])
  const [tutorial, setTutorial] = useState(null)
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  // États pour gérer la catégorie sélectionnée
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [dropdownLabel, setDropdownLabel] = useState('Choisissez une catégorie !')
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobile, setMobile] = useState(false)
  
  // État d'authentification
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // Vérifier l'authentification
  useEffect(() => {
    const token = getToken()
    setIsLoggedIn(!!token)
  }, [])

  // Chargement des données API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, tutorialRes, profilesRes] = await Promise.all([
          getCategories(),
          getLandingTutorial(),
          getExampleProfiles(3)
        ])
        
        setCategories(categoriesRes.categories || [])
        setTutorial(tutorialRes.tutorial)
        
        // Adapter les profils au format ContentPreview
        const adaptedProfiles = profilesRes.users.map(user => ({
          id: user.id.toString(),
          name: user.username,
          avatarUrl: user.profilePicture
        }))
        setProfiles(adaptedProfiles)
      } catch (error) {
        console.error('Erreur chargement données:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Gestion responsive
  useEffect(() => {
    const isMobile = () => window.innerWidth < 768
    const handleResize = () => {
      setMobile(isMobile())
    }

    // Initialisation
    handleResize()
    
    // Auto-select première catégorie sur mobile
    if (isMobile() && !selectedCategory && categories.length > 0) {
      setSelectedCategory(categories[0])
      setDropdownLabel(categories[0].title)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [selectedCategory, categories])

  // Fonctions de navigation
  const navigateSlide = (direction) => {
    if (categories.length === 0) return

    const maxSlide = categories.length - 1
    let newIndex

    if (direction === 'next') {
      newIndex = currentSlide === maxSlide ? 0 : currentSlide + 1
    } else {
      newIndex = currentSlide === 0 ? maxSlide : currentSlide - 1
    }

    setCurrentSlide(newIndex)
    const newCategory = categories[newIndex]
    setSelectedCategory(newCategory)
    setDropdownLabel(newCategory.title)
  }

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setDropdownLabel(category.title)
    setCurrentSlide(categories.findIndex(cat => cat.id === category.id))
    if (document.activeElement) {
      document.activeElement.blur()
    }
  }

  // Nouvelle fonction pour gérer le clic sur une skill
  const handleSkillClick = (skill) => {
    if (!isLoggedIn) {
      // Afficher message d'invite à la connexion
      alert("Connectez-vous pour voir les profils et tutoriels associés à cette compétence")
      return
    }
    
    // Pour utilisateur connecté - redirection ou action
    // TODO: Implémenter la logique pour afficher les détails de la skill
    console.log('Skill sélectionnée:', skill)
    // window.location.href = `/skills/${skill.skill_id}`
  }

  // Fonction pour ouvrir la modale de connexion
  const openLoginModal = () => {
    const modal = document.getElementById('login_modal') as HTMLDialogElement
    if (modal) {
      modal.showModal()
    }
  }

  if (loading) {
    return (
      <div className="px-4 pt-4">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-center">Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 pt-4">
      <div className="flex flex-col items-center justify-center py-8">
        {/* Gestionnaire de catégories */}
        <CategoryManager
          categories={categories}
          selectedCategory={selectedCategory || (mobile ? categories[0] : null)}
          dropdownLabel={dropdownLabel}
          currentSlide={currentSlide}
          onCategorySelect={handleCategorySelect}
          onNavigateSlide={navigateSlide}
          isLoggedIn={isLoggedIn}
          onSkillClick={handleSkillClick}
          onLoginClick={openLoginModal}
        />
        
        {/* Aperçu du contenu avec vraies données */}
        <ContentPreview
          title={tutorial?.title}
          author={tutorial?.author?.username}
          summary={tutorial?.content}
          posterUrl={tutorial?.picture}
          profiles={profiles}
          isLoggedIn={isLoggedIn}
          onLoginClick={openLoginModal}
        />
      </div>
    </div>
  )
}