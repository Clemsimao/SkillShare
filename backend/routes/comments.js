import express from 'express';
import {
  createComment,
  listCommentsByTutorial,
  updateComment,
  deleteComment
} from '../controllers/commentController.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// ROUTES PUBLIQUES

/**
 * GET /api/comments/tutorial/:tutorialId
 * Lister les commentaires d'un tutoriel
 * Public - pas d'authentification requise
 */
router.get('/tutorial/:tutorialId', listCommentsByTutorial);

// ROUTES PROTÉGÉES (Authentification requise)

/**
 * POST /api/comments
 * Créer un commentaire
 * Protégé - authMiddleware requis
 * Body: { "tutorial_id": number, "content": string }
 */
router.post('/', authMiddleware, createComment);

/**
 * PUT /api/comments/:id
 * Mettre à jour un commentaire (auteur uniquement)
 * Protégé - authMiddleware requis
 * Body: { "content": string }
 */
router.put('/:id', authMiddleware, updateComment);

/**
 * DELETE /api/comments/:id
 * Supprimer un commentaire (auteur uniquement)
 * Protégé - authMiddleware requis
 */
router.delete('/:id', authMiddleware, deleteComment);

export default router;