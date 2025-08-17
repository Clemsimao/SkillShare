# Plan d'actions SkillShare - MVP COMPLET

## Actions urgentes (Avant démarrage)
- [ ] **Créer compte Cloudinary** (gratuit, 5min)
- [ ] **Désigner référent technique** de l'équipe
- [ ] **Valider horaire daily meetings** : 9h-9h30

---

## **Phase 1 : Fondations & Landing Page**

### Tâches Backend
- [ ] Transformation MPD SQL vers Modèles Sequelize + associations (user, category, skill, tutorial, comments)
- [ ] Configuration Docker complète (docker-compose.yml, Dockerfiles) + Base PostgreSQL
- [ ] Structure Express/MVC + middlewares (JWT, Argon2, Express Validator)
- [ ] Seeds/fixtures de données test
- [ ] Configuration Cloudinary

### Tâches Frontend
- [ ] Setup Next.js + TypeScript + structure dossiers + routing
- [ ] Configuration Dockerfile Frontend
- [ ] Setup SASS + composants base + layout responsive
- [ ] Landing page avec présentation SkillShare (UC1)

### Objectifs Phase 1
- [ ] **Modèles Sequelize complets** avec relations M:N (user_skills, user_interests, etc.)
- [ ] **Configuration Docker complète** (Frontend + Backend + PostgreSQL)
- [ ] **Seeds de données test** pour développement
- [ ] **Configuration Cloudinary** opérationnelle
- [ ] **UC1** : Landing page avec présentation claire
- [ ] **Route d'authentification testée Frontend vers Backend**

---

## **Phase 2 : Authentification & Profils (UC3-UC9)**

### Tâches Backend
- [ ] Routes auth (`/api/auth/inscription`, `/connexion`, `/deconnexion`) + UC3, UC4, UC5
- [ ] CRUD utilisateurs + UC8, UC9 (mise à jour/suppression profil)
- [ ] Relations user-skills/interests + UC6, UC7 (compétences/intérêts)
- [ ] Upload photo de profil via Cloudinary
- [ ] Route pour profils exemple (pour landing page)

### Tâches Frontend
- [ ] Pages login/register + protection routes + gestion état auth (UC3, UC4, UC5)
- [ ] Page profil utilisateur + formulaires compétences/intérêts (UC6, UC7, UC8)
- [ ] Composant upload photo de profil + preview
- [ ] Intégration profils exemple sur landing page (UC2)

### Objectifs Phase 2
- [ ] **UC3-UC5** : Inscription/Connexion/Déconnexion fonctionnelles
- [ ] **UC6-UC7** : Gestion compétences/intérêts complète
- [ ] **UC8-UC9** : Modification/suppression profil
- [ ] **UC2** : Profils d'exemples visibles sur landing page
- [ ] Upload photo de profil fonctionnel

---

## **Phase 3 : Recherche & Tutoriels (UC10-UC18)**

### Tâches Backend
- [ ] Routes recherche (`/api/recherche?competence=`) + UC15, UC16 (recherche compétences)
- [ ] CRUD tutoriels + UC10-UC14 (création, consultation, modification, suppression tutoriels)
- [ ] Upload images illustratives tutoriels via Cloudinary
- [ ] Routes profils + UC17, UC18 (visualisation profils et détails)

### Tâches Frontend
- [ ] Moteur recherche + page résultats + filtres (UC15-UC16)
- [ ] Pages visualisation profils et détails (UC17, UC18)
- [ ] Création/édition tutoriels + upload images illustratives (UC10-UC14)
- [ ] Page consultation tutoriel + navigation

### Objectifs Phase 3
- [ ] **UC15-UC16** : Recherche par compétences fonctionnelle
- [ ] **UC17-UC18** : Visualisation profils et détails
- [ ] **UC10-UC14** : CRUD tutoriels complet
- [ ] Upload images illustratives tutoriels

---

## **Phase 4 : Contact, Suivi & Évaluations (UC19-UC28)**

### Tâches Backend
- [ ] Système commentaires + UC19, UC20 (commentaires et réponses)
- [ ] Formulaire contact + UC21
- [ ] Système suivis + UC22-UC24 (suivre, arrêter suivi, voir abonnés)
- [ ] Système évaluations + UC25-UC28 (évaluer utilisateurs/tutoriels, consulter évaluations)

### Tâches Frontend
- [ ] Interface commentaires sur tutoriels (UC19, UC20)
- [ ] Formulaire contact entre utilisateurs (UC21)
- [ ] Interface suivis + gestion abonnés (UC22-UC24)
- [ ] Système évaluations utilisateurs et tutoriels (UC25-UC28)

### Objectifs Phase 4
- [ ] **UC19-UC21** : Système de contact complet (commentaires + formulaire)
- [ ] **UC22-UC24** : Système de suivi fonctionnel
- [ ] **UC25-UC28** : Évaluations utilisateurs et tutoriels
- [ ] Toutes fonctionnalités MVP opérationnelles

---

## **Phase 5 : Finalisation & Tests**

### Tâches Backend
- [ ] Tests d'intégration + optimisations
- [ ] Sécurisation finale + documentation API

### Tâches Frontend
- [ ] Responsive design final + tests cross-browser
- [ ] Tests parcours utilisateur complet (UC1 vers UC28)
- [ ] Polish UX/UI + corrections bugs + accessibilité

### Objectifs Phase 5
- [ ] **Tests complets** des 28 Use Cases
- [ ] Application responsive parfaite
- [ ] Application production-ready

---

## Checklist MVP obligatoire

### Fonctionnalités core
- [ ] **Landing page** avec présentation + profils exemple
- [ ] **Inscription/connexion** sécurisées (JWT + Argon2)
- [ ] **Profil détaillé** (compétences, intérêts, disponibilités)
- [ ] **Création et gestion des tutoriels** (CRUD complet)
- [ ] **Upload photos de profil et images illustratives tutoriels** (Cloudinary)
- [ ] **Moteur recherche** par compétences avec filtres
- [ ] **Système de suivi** (suivre/ne plus suivre)
- [ ] **Contact entre utilisateurs** pour échanges
- [ ] **Évaluations** après échange (1-5 étoiles)

### Aspects techniques
- [ ] **SPA responsive** (mobile, tablet, desktop)
- [ ] **API REST** sécurisée avec validation
- [ ] **Base données** PostgreSQL avec relations complexes
- [ ] **Conteneurisation Docker** complète (Frontend + Backend + BDD)
- [ ] **Tests** unitaires et d'intégration
- [ ] **Documentation** API complète

---

## Points de synchronisation critiques

### **Fin Phase 1**
- [ ] **Modèles Sequelize** complets avec associations M:N
- [ ] **UC1** : Landing page avec présentation claire
- [ ] **Configuration Docker stable** pour toute l'équipe
- [ ] **Seeds de données** opérationnelles
- [ ] **Format réponse JSON validé par les 2 équipes**

### **Fin Phase 2**
- [ ] **UC3-UC9** validés (Auth + Profils complets)
- [ ] **UC2** : Profils d'exemples intégrés sur landing page
- [ ] **Première intégration API réussie** (Auth + Profils)

### **Fin Phase 3**
- [ ] **UC10-UC18** validés (Recherche + Tutoriels)
- [ ] **Tests parcours** recherche et création tutoriel

### **Fin Phase 4**
- [ ] **UC19-UC28** validés (Contact + Suivi + Évaluations)
- [ ] **Toutes fonctionnalités MVP opérationnelles**

### **Fin Phase 5**
- [ ] **Tests complets des 28 Use Cases**
- [ ] Application production-ready