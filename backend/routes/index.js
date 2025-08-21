import express from 'express';
import multer from 'multer';
import authRoutes from './auth.js';
import userRoutes from './users.js';
import skillRoutes from './skills.js';
import tutoRoutes from './tutorial.js';
import searchRoutes from './search.js';  // NOUVEAU : Routes de recherche

const router = express.Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateurs (CRUD profils)
router.use('/users', userRoutes);

// Routes compétences/catégories (données de référence)
router.use('/skills', skillRoutes);

// Routes tutoriels (upload images, etc.)
router.use('/tutorials', tutoRoutes);

// Routes de recherche (protégées)
router.use('/search', searchRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API SkillSwap opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Route d'accueil API avec documentation des endpoints
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API SkillSwap',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/profil'
      },
      skills: {
        list: 'GET /api/skills',
        categories: 'GET /api/skills/categories'
      },
      users: {
        examples: 'GET /api/users/examples',
        publicProfile: 'GET /api/users/profile/:id',
        updateProfile: 'PUT /api/users/profile',
        deleteProfile: 'DELETE /api/users/profile',
        addSkill: 'POST /api/users/skills (body: {skillId})',
        removeSkill: 'DELETE /api/users/skills/:skillId',
        addInterest: 'POST /api/users/interests (body: {skillId})',
        removeInterest: 'DELETE /api/users/interests/:skillId'
      },
      tutorials: {
        uploadImage: 'POST /api/tutorials/:id/image'
      },
      search: {
        users: 'GET /api/search/users?skillId={ID}&page=1 (Auth required)',
        tutorials: 'GET /api/search/tutorials?skillId={ID}&page=1 (Auth required)'
      },
      utils: {
        health: 'GET /api/health'
      }
    }
  });
});

// Gestion des erreurs d'upload
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Une erreur de Multer est survenue lors de l'upload
    console.error('Erreur Multer:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'upload de l\'image' });
  } else if (err) {
    // Une erreur inconnue est survenue
    console.error('Erreur serveur:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
  next();
});

export default router;