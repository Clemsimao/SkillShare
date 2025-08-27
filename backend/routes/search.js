import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import { searchUsers, searchTutorials } from '../controllers/searchController.js';

const router = express.Router();

/**
 * GET /api/search/users?skillId={ID_DYNAMIQUE}&page=1
 * Recherche utilisateurs qui maîtrisent une compétence
 * L'ID vient du clic frontend sur une skill de /api/skills
 * Route protégée - Visiteurs voient "connectez-vous", membres voient les profils
 */
router.get('/users', authMiddleware, searchUsers);

/**
 * GET /api/search/tutorials?skillId={ID_DYNAMIQUE}&page=1  
 * Recherche tutoriels écrits par des experts de cette compétence
 * L'ID vient du clic frontend sur une skill de /api/skills
 * Route protégée - Trouve contenus pédagogiques d'auteurs qualifiés
 */
router.get('/tutorials', authMiddleware, searchTutorials);

export default router;