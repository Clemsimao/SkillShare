import express from 'express';
import authRoutes from './auth.js';
import userRoutes from './users.js'; 
import skillRoutes from './skills.js'; 

const router = express.Router();

// Routes d'authentification
router.use('/auth', authRoutes);

// Routes utilisateurs (CRUD profils)
router.use('/users', userRoutes);

// Routes compétences/catégories (données de référence)
router.use('/skills', skillRoutes);

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
      utils: {
        health: 'GET /api/health'
      }
    }
  });
});

export default router;