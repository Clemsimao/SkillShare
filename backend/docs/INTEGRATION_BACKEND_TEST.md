# Documentation Intégration Backend ↔ Frontend - SkillSwap

> **Date :** 25 août 2025  
> **Objectif :** Connecter le frontend Next.js au backend Node.js/Express  
> **Statut :** ✅ **TERMINÉ ET VALIDÉ**

---

## Stack Technique

### Backend
- **Node.js 20** + Express.js
- **PostgreSQL 16** (Docker)
- **JWT** (jsonwebtoken) + **Argon2** (hashing)
- **Sequelize ORM**
- **Docker Compose**

### Frontend  
- **Next.js 15** + React 19
- **TypeScript 5.9**
- **TailwindCSS + DaisyUI**
- **Axios** (à installer)

---

## Problèmes Résolus

### 1. Configuration CORS Backend

**Problème :** Frontend ne pouvait pas communiquer avec l'API

**Solution :** Configuration CORS dans `app.js`
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',      // Pour les requêtes JSON
    'Authorization'      // Pour les tokens JWT
  ]
}));
```

**Résultat :** ✅ Headers CORS corrects, JWT autorisé dans les requêtes

### 2. Crash Argon2 dans Docker Alpine

**Problème :** `Empty reply from server` lors du register  
**Cause :** Argon2 nécessite des dépendances natives absentes dans Alpine Linux

**Solutions testées :**
1. ❌ Alpine + installation manuelle (`apk add python3 make g++`) 
2. ✅ **Migration vers `node:20` standard**

**Dockerfile final :**
```dockerfile
FROM node:20

# Installer netcat pour l'attente Postgres
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=development
ENV PORT=8000
COPY package*.json ./
RUN npm i
RUN npm install -g nodemon
COPY . .
EXPOSE 8000
CMD ["npm", "run", "dev"]
```

**Résultat :** ✅ Argon2 fonctionne, register opérationnel

### 3. Debugging Controller Register

**Problème :** Crash silencieux sans logs d'erreur

**Solution :** Ajout de logs de debugging
```javascript
export const register = async (req, res) => {
  try {
    console.log('📋 Register START - Body reçu:', req.body);
    console.log('✅ Validation des champs OK');
    console.log('🔍 Vérification email existant...');
    console.log('🔐 Hash du mot de passe...');
    console.log('💾 Création utilisateur en base...');
    // ...
  } catch (error) {
    console.error('❌ ERREUR COMPLÈTE:', error);
  }
};
```

**Résultat :** ✅ Identification précise du problème Argon2

---

## Tests de Validation

### Tests CORS
```bash
# Test 1 - API de base
curl http://localhost:8000/api/health
# Résultat : ✅ {"success":true,"message":"API SkillSwap opérationnelle"}

# Test 2 - CORS avec Origin
curl -H "Origin: http://localhost:3000" -v http://localhost:8000/api/skills
# Résultat : ✅ Headers CORS présents

# Test 3 - CORS Preflight (OPTIONS)
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: authorization" \
     -X OPTIONS -v http://localhost:8000/api/auth/login
# Résultat : ✅ Authorization header autorisé
```

### Tests Endpoints Publics
```bash
# Skills
curl http://localhost:8000/api/skills
# ✅ {"success":true,"message":"Compétences récupérées avec succès","skills":[...]}

# Tutorials Landing  
curl http://localhost:8000/api/tutorials/landing
# ✅ {"success":true,"message":"Tutoriel landing page récupéré","tutorial":{...}}

# Users Examples
curl http://localhost:8000/api/users/examples  
# ✅ {"success":true,"message":"Profils exemple récupérés avec succès","users":[...]}
```

### Tests Authentification
```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","username":"testuser","email":"test@test.com","password":"password123","birthdate":"1990-01-01"}'
# ✅ {"success":true,"message":"Inscription réussie !","user":{...},"token":"eyJhbGciOi..."}

# Login  
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
# ✅ {"success":true,"message":"Connexion réussie !","user":{...},"token":"eyJhbGciOi..."}
```

### Tests Endpoints Protégés
```bash
# Recherche utilisateurs (avec JWT)
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/search/users?skillId=1
# ✅ {"success":true,"message":"1 utilisateur(s) trouvé(s)","users":[...]}

# Profil utilisateur (avec JWT)  
curl -H "Authorization: Bearer <TOKEN>" \
  http://localhost:8000/api/auth/profil
# ✅ {"success":true,"user":{"id":6,"email":"test@test.com",...}}
```

---

## Endpoints Validés

### Endpoints Publics
| Endpoint | Méthode | Description | Statut |
|----------|---------|-------------|---------|
| `/api/skills` | GET | Liste des compétences | ✅ |
| `/api/tutorials/landing` | GET | Tutorial d'exemple | ✅ |
| `/api/users/examples` | GET | Utilisateurs exemples | ✅ |

### Authentification  
| Endpoint | Méthode | Description | Format Body | Statut |
|----------|---------|-------------|-------------|---------|
| `/api/auth/register` | POST | Inscription | `{firstName, lastName, username, email, password, birthdate}` | ✅ |
| `/api/auth/login` | POST | Connexion | `{email, password}` | ✅ |

### Endpoints Protégés (JWT requis)
| Endpoint | Méthode | Description | Headers | Statut |
|----------|---------|-------------|---------|---------|
| `/api/search/users?skillId=X` | GET | Recherche utilisateurs | `Authorization: Bearer <token>` | ✅ |
| `/api/auth/profil` | GET | Profil utilisateur | `Authorization: Bearer <token>` | ✅ |

---

## Format des Réponses API

### Réponse Standard
```json
{
  "success": boolean,
  "message": string,
  "data": object | array
}
```

### Exemples de Réponses

**Skills :**
```json
{
  "success": true,
  "message": "Compétences récupérées avec succès",
  "skills": [
    {
      "id": 1,
      "title": "JavaScript", 
      "category": {"id": 1, "title": "Programmation"}
    }
  ],
  "count": 5
}
```

**Login/Register :**
```json
{
  "success": true,
  "message": "Connexion réussie !",
  "user": {
    "id": 6,
    "email": "test@test.com",
    "firstName": "Test",
    "lastName": "User", 
    "username": "testuser"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Search Users :**
```json
{
  "success": true,
  "message": "1 utilisateur(s) trouvé(s)",
  "users": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "username": "johndoe",
      "profilePicture": null,
      "skills": [{"id": 1, "name": "JavaScript", "category": "Programmation"}]
    }
  ],
  "pagination": {
    "page": 1,
    "totalCount": 1,
    "totalPages": 1,
    "hasNext": false
  }
}
```

---

## ✅ Validation Complète

### Backend (Terminé)
- ✅ CORS configuré pour `localhost:3000`
- ✅ JWT fonctionnel avec headers `Authorization`  
- ✅ Tous les endpoints prioritaires testés
- ✅ Format de réponse standardisé `{success, message, data}`
- ✅ Gestion d'erreurs appropriée
- ✅ Docker opérationnel avec Argon2

## Troubleshooting

### Problèmes CORS
**Symptômes :** `Access-Control-Allow-Origin` errors  
**Solutions :**  
- Vérifier que le backend tourne sur port 8000
- Confirmer Origin `http://localhost:3000` dans la config CORS

### Problèmes JWT  
**Symptômes :** 401 Unauthorized  
**Solutions :**
- Vérifier format header : `Authorization: Bearer <token>`
- Contrôler expiration du token (24h par défaut)
- Vérifier variable `JWT_SECRET` dans `.env`

### Problèmes Docker
**Symptômes :** Container crash, dépendances manquantes  
**Solutions :**
- Utiliser `node:20` au lieu de `node:20-alpine`
- Installer `netcat-openbsd` pour l'attente Postgres
- Rebuild avec `docker compose build --no-cache`
