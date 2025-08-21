# Architecture Frontend SkillSwap - Checklist

## Logique de l'architecture: 
- Structure adapté au mobile-first (App Router, pages principales sous app/, slugs pour les écrans détail, une seule modale globale, composants réutilisables).

## Structure de dossiers

### **DOSSIER APP:**------------------------------------ 
`src/app/` - Contient les pages accessibles via des URLs: `/login, /signup, /catgories, etc.`

#### Fichiers racine
- [x] `favicon.ico`
- [x] `globals.css`
- [x] `layout.tsx` 
- [x] `page.tsx` (Écran Accueil - Landing page)

#### Routes d'authentification
- [x] `login/`
  - [x] `page.tsx` (Écran Connexion plein écran)
- [x] `signup/`
  - [x] `page.tsx` (Écran Inscription plein écran)

#### Routes catégories
- [x] `categories/`
  - [x] `page.tsx` (Écran Catégories - liste)
  - [x] `[categorySlug]/`
    - [x] `page.tsx` (Écran Catégorie - détail, un seul écran pour toutes)

#### Routes compétences
- [x] `skills/`
  - [x] `page.tsx` (Écran Compétences - filtres + liste)
  - [x] `[skillSlug]/`
    - [x] `page.tsx` (Écran Compétence - détail)
    - [x] `comments/`
      - [x] `page.tsx` (Écran Commentaires de la compétence)

#### Routes profil
- [x] `profile/`
  - [x] `[username]/`
    - [x] `page.tsx` (Écran Profil)
    - [x] `about/`
      - [x] `page.tsx` (Écran "À propos")
    - [x] `favorites/`
      - [x] `page.tsx` (Écran "Favoris")

#### Routes galerie
- [x] `gallery/`
  - [x] `page.tsx` (Écran Galerie)


### **DOSSIER COMPONENTS:**------------------------------------
`src/components/` - Sections de composants réutilisables: tout est géré en props

#### Composants communs
- Briques transverses visibles partout.

- [x] `common/`
  - [x] Modal `Modal.tsx`(conteneur réutilisable pour tout)
  - [x] Navbar `Navbar.tsx`
  - [x] Footer `Header.tsx`
  - [x] Footer `Footer.tsx` 
  - [ ] (option - Mobile) 
    - [ ] Menu mobile `MobileNav.tsx`
    - [ ] Switch clair / sombre (DaisyUI)`ThemeToggle.tsx` 
    - [ ] Icone générique mobile `IconButton.tsx`  
  - [x] `index.ts` pour ré-exporter tout le dossier

#### Providers & orchestration
- Couches d’orchestration globales (monté une fois dans le `layout.tsx`).

- [x] `providers/`
  - [x] ModalLayer `ModalLayer.tsx` (orchestrateur de la modale globale: ouvre/ferme la modale depuis l'URL) 
  - [x] `index.ts `- réexport

#### Composants d'authentification
- Contenus des formauliares d'auth réutilisable

- [x] `auth/`
  - [x] LoginForm `LoginForm.tsx` (contenu modale form. de connexion utilisable en modale et en page /login)
  - [x] SignupForm `signUpForm.tsx` (contenu modale form. d'inscription utilisable en modale et en page /signup)

#### Composants page d'accueil
- sections propres à la landing

- [x] `home/`
  - [x] CategorySlider: `CategorySlider.tsx`
  - [x] BestPicks: `BestPicks.tsx` bloc meilleurs tutos ou skills
  - [x] `index.ts` réexport

#### Composants catégories
- UI liée aux catégories

- [x] `categories/`
  - [x] Listes catégories : `CategoryList.tsx`
  - [x] Carte catégories: `CategoryCard.tsx`
  - [x] `index.ts` réexport 

#### Composants compétences
- UI liée aux compétences.

- [x] `skills/`
  - [x] FilterBar: `FilterBar.tsx`
  - [x] SkillCard: `SkillCard.tsx`
  - [x] SkillGrid: `SkillGrid.tsx`
  - [x] `index.ts` réexport 

  #### Composants profil
  - sections du profil utilisateur (réutilisables dans l’écran profil et sous-écrans).

- [x] `profile/` – dossier des composants profil
  - [x] `ProfileHeader.tsx` – avatar, pseudo, stats (tutos, abonnés, abonnements)
  - [x] `ProfileTabs.tsx` – onglets locaux (About / Favoris)
  - [x] `ProfileAbout.tsx` – bloc "About me" (aperçu)
  - [x] `ProfileFavorites.tsx` – liste courte de tutos favoris (aperçu)
  - [x] `ProfileCounters.tsx` – Abonnements / Abonnées boutons-compteurs
  - [x] `index.ts` – ré-export

### **DOSSIER LIB:**------------------------------------
`src/lib/` - Utilitaires & logique métier:  boîte à outils “non-UI” : tout ce qui n’est ni composant React, ni style, mais qui porte la logique réutilisable et indépendante de l’interface.

- [x] API client pour centraliser tous les appels réseau (front → back): `api-client.ts`
- [x] Navigation helpers : manipuler les URLs proprement (mobile-first): `navigation.ts`
- [x] Utils génériques : regrouper les helpers transverses: `utils.ts`
- [x] Constantes globales : valeurs paratagées nonsecrètes: `constants.ts`

### **DOSSIER TYPES:**------------------------------------
`src/types/` - Types TypeScript

- [x] `category.ts` (types catégories)
- [x] `skill.ts` (types compétences)
- [x] `user.ts` (types utilisateur)

### **DOSSIER PUBLIC:**------------------------------------
`public/` - Assets statiques

- [x] `icons/` (dossier icônes)

-----------

## Configuration & Setup

### Fichiers de configuration
- [ ] `tailwind.config.js` (avec daisyUI) **DEPRECIE à partir de la v4**
- [ ] `postcss.config.js`
- [ ] `next.config.js`
- [ ] `tsconfig.json` (avec alias @/*)
- [ ] `.env.local` (variables d'environnement)

### Packages essentiels
- [ ] Next.js 15+ avec App Router
- [ ] TypeScript
- [ ] Tailwind CSS + daisyUI
- [ ] Headless UI
- [ ] Lucide React (icônes)
- [ ] React Hook Form + Zod

--------------------------------------------

## Fonctionnalités à implémenter

### Système de modales
- [ ] Modal Provider global
- [ ] Modal Container réutilisable
- [ ] Gestion des overlays et focus

### Navigation
- [ ] Navbar responsive
- [ ] Breadcrumbs si nécessaire
- [ ] États actifs des liens

### Authentification
- [ ] Formulaires login/signup
- [ ] Validation côté client
- [ ] Gestion des erreurs

### Interface utilisateur
- [ ] Design system cohérent
- [ ] Composants réutilisables
- [ ] Responsive design
- [ ] Dark mode (via daisyUI)

### Performance
- [ ] Optimisation images
- [ ] Code splitting
- [ ] Server Components quand possible
- [ ] Lazy loading