import express from 'express';
import { getPublicProfile, updateProfile, deleteProfile, getExampleProfiles } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// ROUTES PUBLIQUES

/**
 * GET /api/users/examples
 * Récupérer des profils exemple pour la landing page
 * Public - pas d'authentification requise
 */
router.get('/examples', getExampleProfiles);

/**
 * GET /api/users/profile/:id
 * Récupérer le profil public d'un utilisateur
 * Public - pas d'authentification requise
 */
router.get('/profile/:id', getPublicProfile);


// ROUTES PROTÉGÉES (Authentification requise)

/**
 * PUT /api/users/profile
 * Mettre à jour son propre profil
 * Protégé - authMiddleware requis
 */
router.put('/profile', authMiddleware, updateProfile);

/**
 * DELETE /api/users/profile
 * Supprimer son propre compte
 * Protégé - authMiddleware requis
 */
router.delete('/profile', authMiddleware, deleteProfile);

export default router;