# Architecture Frontend SkillSwap - Checklist (V1)

## Logique de l'architecture:
- Structure adaptée au mobile-first (App Router, pages principales sous app/, slugs pour les écrans détail, une seule modale globale, composants réutilisables).
- Sur la **Landing (`/`)** : affichage du menu déroulant de catégories et des **skills dynamiques** sur la même page.
- Clic sur un **skill** → navigation vers `/skills/[skillSlug]` qui affiche la liste des tutos liés.
- Clic sur un **tuto** → navigation vers `/tutorials/[id]` (page détail).  
- ⚠️ **Commentaires** : **affichés sous le contenu du tuto** sur `/tutorials/[id]` (pas de route séparée).

---

## Structure de dossiers

### **DOSSIER APP:**------------------------------------
`src/app/` - Contient les PAGES accessibles via des URLs: `/login, /signup, /skills, etc.`

#### Fichiers racine
- [x] `favicon.ico`
- [x] `globals.css`  
- [x] `layout.tsx`  <!-- Shell global (Header, Footer, providers) -->
- [x] `page.tsx` <!-- Landing = catégories + (skills dynamiques)  -->

#### Routes d'authentification
- [x] `login/`
  - [x] `page.tsx` (Écran Connexion plein écran)
- [x] `signup/`
  - [x] `page.tsx` (Écran Inscription plein écran)

#### Routes compétences
- [x] `skills/`
  - [x] `[skillSlug]/`
    - [x] `page.tsx` <!-- Cette page récupère tous les tutos liés à un skill cliqué depuis la landing -->

#### Routes tutos
- [ ] `tutorials/`
  - [ ] `[id]/`
    - [ ] `page.tsx` (Écran détail d’un tuto **avec bloc "Commentaires" en dessous du contenu**)

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

---

### **DOSSIER COMPONENTS:**------------------------------------
`src/components/` - Sections de composants réutilisables: tout est géré en props

#### Composants communs
- Briques transverses visibles partout.

- [x] `common/`
  - [x] Modal `Modal.tsx` (conteneur réutilisable pour tout)
  - [x] Navbar `Navbar.tsx`
  - [x] Header `Header.tsx`
  - [x] Footer `Footer.tsx`
  - [ ] (option - Mobile)
    - [ ] Menu mobile `MobileNav.tsx`
    - [ ] Switch clair / sombre (DaisyUI) `ThemeToggle.tsx`
    - [ ] Icône générique mobile `IconButton.tsx`  
  - [x] `index.ts` pour ré-exporter tout le dossier

#### Providers & orchestration
- Couches d’orchestration globales (montées une fois dans le `layout.tsx`).

- [x] `providers/`
  - [x] ModalLayer `ModalLayer.tsx` (orchestrateur de la modale globale: ouvre/ferme la modale depuis l'URL) 
  - [x] `index.ts` - réexport

#### Composants d'authentification
- Contenus des formulaires d’auth réutilisables

- [x] `auth/`
  - [x] LoginForm `LoginForm.tsx` (contenu modale form. de connexion utilisable en modale et en page /login)
  - [x] SignupForm `SignupForm.tsx` (contenu modale form. d'inscription utilisable en modale et en page /signup)

#### Composants page d'accueil
- Sections propres à la landing

- [x] `home/`
  - [x] CategoryDropdown: `CategoryDropdown.tsx` <!-- Sélecteur de catégories : ne change pas de page, met à jour la landing -->
  - [x] SkillList: `SkillList.tsx` (liste dynamique affichée après sélection catégorie)  <!-- Affiche dynamiquement les skills d’une catégorie sélectionnée -->
  - [x] BestPicks: `BestPicks.tsx` bloc meilleurs tutos ou skills
  - [x] `index.ts` réexport

#### Composants compétences
- UI liée aux compétences.

- [x] `skills/`
  - [x] SkillCard: `SkillCard.tsx`
  - [x] SkillGrid: `SkillGrid.tsx`
  - [x] `index.ts` réexport 

#### Composants tutos
- UI liée aux tutos (carte/liste) **et** au bloc commentaires intégré à la page détail.

- [ ] `tutorials/`
  - [ ] TutorialCard: `TutorialCard.tsx`
  - [ ] TutorialList: `TutorialList.tsx`
  - [ ] CommentItem: `CommentItem.tsx` <!-- Un commentaire -->
  - [ ] CommentList: `CommentList.tsx` <!-- Liste des commentaires -->
  - [ ] CommentForm: `CommentForm.tsx` <!-- Formulaire pour ajouter un commentaire -->
  - [ ] `index.ts` réexport

#### Composants profil
- Sections du profil utilisateur (réutilisables dans l’écran profil et sous-écrans).

- [x] `profile/`
  - [x] `ProfileHeader.tsx` – avatar, pseudo, stats (tutos, abonnés, abonnements)
  - [x] `ProfileInfoList.tsx` : liste “Nom/Prénom, Âge, Sexe, Localisation”
  - [x] `ProfileAbout.tsx` – bloc "About me" (aperçu)
  - [x] `ProfileFavorites.tsx` – liste courte de tutos favoris (aperçu)
  - [x] `ProfileCounters.tsx` – Abonnements / Abonnées boutons-compteurs
  - [x] `index.ts` – ré-export

---

### **DOSSIER LIB:**------------------------------------
`src/lib/` - Utilitaires & logique métier: boîte à outils “non-UI” : tout ce qui n’est ni composant React, ni style, mais qui porte la logique réutilisable et indépendante de l’interface.

- [x] API client pour centraliser tous les appels réseau (front → back): `api-client.ts`
  - `getCategories()`
  - `getSkillsByCategory(categorySlug)`
  - `getTutorialsBySkill(skillSlug)`
  - `getCommentsByTutorial(tutorialId)` <!-- utilisé dans /tutorials/[id] -->
  - `addComment(tutorialId, content)`   <!-- utilisé dans /tutorials/[id] -->
- [x] Navigation helpers : manipuler les URLs proprement (mobile-first): `navigation.ts`
- [x] Utils génériques : regrouper les helpers transverses: `utils.ts`
- [x] Constantes globales : valeurs partagées non secrètes: `constants.ts`

---

### **DOSSIER TYPES:**------------------------------------
`src/types/` - Types TypeScript

- [x] `category.ts` (types catégories)
- [x] `skill.ts` (types compétences)
- [x] `tutorial.ts` (types tutos)
- [x] `comment.ts` (types commentaires liés aux tutos)
- [x] `user.ts` (types utilisateur)

---

### **DOSSIER PUBLIC:**------------------------------------
`public/` - Assets statiques

- [x] `icons/` (dossier icônes)

---

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

---

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
