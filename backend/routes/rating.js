import express from 'express';
import { authMiddleware } from '../middlewares/auth.js';
import {
  rateUser,
  rateTutorial,
  getUserRatings,
  getUserRating,
  getTutorialRating
} from '../controllers/ratingController.js';

const router = express.Router();

/**
 * POST /api/ratings/users/:id/rate
 * Noter un utilisateur (1–5)
 * Protégé - nécessite un token JWT valide
 * Body attendu: { "rating": number }
 */
router.post('/users/:id/rate', authMiddleware, rateUser);

/**
 * GET /api/ratings/users/:id/ratings
 * Lister toutes les évaluations reçues par un utilisateur
 * Public - pas d'authentification requise
 */
router.get('/users/:id/ratings', getUserRatings);

/**
 * GET /api/ratings/users/:id/rating
 * Récupérer la moyenne et le nombre de notes reçues par un utilisateur
 * Public - pas d'authentification requise
 */
router.get('/users/:id/rating', getUserRating);

/**
 * POST /api/ratings/tutorials/:id/rate
 * Liker ou disliker un tutoriel
 * Protégé - nécessite un token JWT valide
 * Body attendu: { "isLiked": boolean }
 */
router.post('/tutorials/:id/rate', authMiddleware, rateTutorial);

/**
 * GET /api/ratings/tutorials/:id/ratings
 * Récupérer les statistiques likes/dislikes d’un tutoriel
 * Public - pas d'authentification requise
 */
router.get('/tutorials/:id/ratings', getTutorialRating);

export default router;