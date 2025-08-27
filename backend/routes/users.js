import express from 'express';
import { getPublicProfile, updateProfile, deleteProfile, getExampleProfiles, addUserSkill, removeUserSkill, addUserInterest, removeUserInterest, uploadProfilePicture } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/auth.js';

import { uploadAvatar } from '../config/multer.js';

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
 * POST /api/users/profile/picture
 * Upload / mettre à jour la photo de profil
 * Protégé - authMiddleware requis
 * Body (form-data): key "avatar" (type File)
 */
router.post(
  '/profile/picture',
  authMiddleware,
  uploadAvatar.single('avatar'),
  uploadProfilePicture
);

/**
 * DELETE /api/users/profile
 * Supprimer son propre compte
 * Protégé - authMiddleware requis
 */
router.delete('/profile', authMiddleware, deleteProfile);

/**
 * POST /api/users/skills
 * Ajouter une compétence à son profil
 * Route protégée (authMiddleware requis)
 * Body: { "skillId": 123 }
 */
router.post('/skills', authMiddleware, addUserSkill);

/**
 * DELETE /api/users/skills/:skillId
 * Retirer une compétence de son profil
 * Route protégée (authMiddleware requis)
 */
router.delete('/skills/:skillId', authMiddleware, removeUserSkill);

/**
 * POST /api/users/interests
 * Ajouter un intérêt à son profil
 * Route protégée (authMiddleware requis)
 * Body: { "skillId": 123 }
 */
router.post('/interests', authMiddleware, addUserInterest);

/**
 * DELETE /api/users/interests/:skillId
 * Retirer un intérêt de son profil
 * Route protégée (authMiddleware requis)
 */
router.delete('/interests/:skillId', authMiddleware, removeUserInterest);

export default router;