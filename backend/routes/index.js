import express from 'express';
import authRoutes from './auth.js';

const router = express.Router();

// Monter les routes d'auth sur /auth
router.use('/auth', authRoutes);

// Route de santé
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API SkillSwap opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Route d'accueil API
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Bienvenue sur l\'API SkillSwap',
    endpoints: {
      auth: '/api/auth',
      health: '/api/health'
    }
  });
});

export default router;