import express from 'express';
import multer from 'multer';
import authRoutes from './auth.js';
import tutoRoutes from './tutorial.js';

const router = express.Router();

// Monter les routes d'auth sur /auth
router.use('/auth', authRoutes);
router.use('/tutorials', tutoRoutes);



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

// Gestion des erreurs d'upload
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Une erreur de Multer est survenue lors de l'upload
    console.error('Erreur Multer:', err);
    return res.status(500).json({ success: false, message: 'Erreur lors de l\'upload de l\'image' });
  } else if (err) {
    // Une erreur inconnue est survenue
    console.error('Erreur inconnue:', err);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
  next();
});

export default router;