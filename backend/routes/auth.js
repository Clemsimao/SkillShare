import express from 'express';
import { register, login, logout, getProfile } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Routes d'authentification
// POST /api/auth/register - Inscription
router.post('/register', register);

// POST /api/auth/login - Connexion
router.post('/login', login);

// POST /api/auth/logout - Déconnexion
router.post('/logout', logout);

// GET /api/auth/profil - Profil utilisateur (PROTÉGÉ)
router.get('/profil', authMiddleware, getProfile);

export default router;