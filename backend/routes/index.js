import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js'; 

const router = express.Router();

// Monter les routes d'auth sur /auth
router.use('/auth', authRoutes);

// Routes utilisateurs (CRUD profils)
router.use('/users', userRoutes);

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
      users: {                              
        examples: 'GET /api/users/examples',
        publicProfile: 'GET /api/users/profile/:id',
        updateProfile: 'PUT /api/users/profile',
        deleteProfile: 'DELETE /api/users/profile'
      },
      utils: {
        health: 'GET /api/health'
      }
    }
  });
});

export default router;