# SkillShare - Plateforme d'Échange de Compétences

![SkillShare Banner](https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop)

## 📌 À Propos

**SkillShare** est une plateforme communautaire permettant l'échange gratuit de savoirs et de compétences. Le principe est simple : chacun a quelque chose à enseigner et quelque chose à apprendre. La plateforme facilite la mise en relation entre passionnés pour encourager l'apprentissage mutuel et collaboratif.

### 🎓 Contexte du Projet

Ce projet a été réalisé dans le cadre du **projet de fin de formation** pour l'obtention du Titre Professionnel **Concepteur Développeur d'Applications (CDA)** au sein de l'école **O'Clock**.

Il a été conçu pour mettre en pratique l'ensemble des compétences acquises durant la formation : architecture complexe, conteneurisation, sécurité, respect des bonnes pratiques et gestion de projet agile.

## 🚀 Fonctionnalités Principales

- **Authentification & Profils** : Inscription sécurisée, gestion de profil détaillé (avatar, bio, localisation).
- **Compétences** : Ajout de compétences (ce que je sais faire) et d'intérêts (ce que je veux apprendre).
- **Recherche Avancée** : Moteur de recherche pour trouver des utilisateurs par compétence ou des tutoriels spécifiques.
- **Tutoriels** : Création, édition et publication de tutoriels (texte, image, vidéo) par la communauté.
- **Interactions** : Système de commentaires sur les tutoriels pour échanger avec les auteurs.
- **Social** : Possibilité de suivre d'autres utilisateurs.

## 🛠️ Stack Technique

**Frontend :**
- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) & [DaisyUI](https://daisyui.com/)

**Backend :**
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [Sequelize ORM](https://sequelize.org/)

**Base de Données :**
- [PostgreSQL](https://www.postgresql.org/)

**DevOps & Outils :**
- [Docker](https://www.docker.com/) & Docker Compose
- Adminer (Gestion BDD)

## 🐳 Installation et Lancement avec Docker

Le projet est entièrement conteneurisé pour faciliter son déploiement et son exécution locale.

### Prérequis

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et lancé sur votre machine.

### Instructions

1. **Cloner le dépôs**
   ```bash
   git clone <votre-url-repo>
   cd SkillShare
   ```

2. **Lancer l'application**
   Exécutez la commande suivante à la racine du projet pour construire les images et lancer les conteneurs :
   
   ```bash
   docker compose up --build
   ```
   > *Note : Cette commande initialise également la base de données avec des données de test (catégories, compétences, utilisateurs exemples).*

3. **Accéder à l'application**

   Une fois les conteneurs lancés (attendre quelques secondes), vous pouvez accéder aux différents services :

   - **Frontend (Application Web)** : [http://localhost:3000](http://localhost:3000)
   - **Backend (API)** : [http://localhost:8000](http://localhost:8000)
   - **Adminer (Interface BDD)** : [http://localhost:8080](http://localhost:8080)
     - *Système :* PostgreSQL
     - *Serveur :* `postgres`
     - *Utilisateur :* `skillshare`
     - *Mot de passe :* `skillshare`
     - *Base de données :* `skillshare`

4. **Arrêter l'application**
   Pour arrêter les conteneurs, faites `Ctrl+C` dans le terminal ou lancez :
   ```bash
   docker compose down
   ```
   
   *Si vous souhaitez réinitialiser la base de données à zéro (effacer toutes les données et remettre les seeds par défaut) :*
   ```bash
   docker compose down -v
   ```

