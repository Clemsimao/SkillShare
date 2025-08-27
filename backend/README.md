# SkillShare Backend

API REST pour la plateforme d'échange de compétences SkillShare.

##  Installation rapide

### Prérequis
- Node.js 20+ LTS
- Docker Desktop
- Git

### Démarrage
```bash
# 1. Cloner et installer
git clone <repository-url>
cd skillswap/backend
npm install

# 2. Configuration
cp .env.example .env
# Éditer .env avec vos vraies valeurs Cloudinary

# 3. Démarrer le serveur
npm run dev
```

##  Scripts disponibles

```bash
npm run dev          # Développement avec nodemon
npm run start        # Production
npm run seeds        # Données de test
npm run test:db      # Test connexion base
npm run docker:up    # Démarrer Docker
npm run docker:down  # Arrêter Docker
npm run lint         # Vérifier le code
npm run format       # Formatter le code
```

## Structure du projet

```
backend/
├── app.js           # Point d'entrée
├── config/          # Configuration (DB, Cloudinary)
├── controllers/     # Logique métier
├── middlewares/     # Auth, validation, upload
├── models/          # Modèles Sequelize
├── routes/          # Endpoints API
├── seeds/           # Données de test
└── utils/           # Fonctions utilitaires
```

## Configuration

### Variables d'environnement (.env)
```bash
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/skillshare
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Troubleshooting

### Erreur "Cannot find module"
```bash
npm install
```

### Erreur de port
```bash
# Changer PORT dans .env ou :
PORT=3001 npm run dev
```

### Problème Docker
```bash
npm run docker:down
npm run docker:up
```

## Contribution

1. Créer une branche : `git checkout -b feature/ma-fonctionnalite`
2. Commit : `git commit -m "feat: add new feature"`
3. Push : `git push origin feature/ma-fonctionnalite`
4. Créer une Pull Request vers `dev-back`

## API Documentation

### Route de test
```
GET / 
→ Status de l'API
```

Plus de documentation API disponible après développement des routes.

## Équipe Backend

- Chloé (Dev Backend)
- Clément (Dev Backend)  
- Julien (Dev Backend)

---
