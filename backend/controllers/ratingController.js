// backend/controllers/ratingController.js
import { ratingService } from '../services/ratingService.js';

/**
 * POST /api/ratings/users/:id/rate
 * Noter un utilisateur (1–5) — JWT requis
 * Body: { "rating": number }
 */
export const rateUser = async (req, res) => {
  try {
    // récup infos
    const evaluatorId = req.user?.id;
    const evaluatedId = Number(req.params.id);
    const { rating } = req.body;

    // validations
    if (!evaluatorId) return res.status(401).json({ success: false, message: 'Non authentifié' });
    if (!Number.isInteger(evaluatedId)) return res.status(400).json({ success: false, message: 'ID utilisateur invalide' });
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'La note doit être un entier entre 1 et 5' });
    }

    // service (upsert)
    const result = await ratingService.rateUser(evaluatorId, evaluatedId, rating);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'Vous ne pouvez pas vous noter vous-même' || error.message === 'Cannot rate yourself') {
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas vous noter vous-même' });
    }
    if (error.message === 'Utilisateur évalué introuvable' || error.message === 'Evaluated user not found') {
      return res.status(404).json({ success: false, message: 'Utilisateur évalué introuvable' });
    }
    console.error('❌ rateUser:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la notation de l’utilisateur' });
  }
};

/**
 * POST /api/ratings/tutorials/:id/rate
 * Like / Dislike un tutoriel — JWT requis
 * Body: { "isLiked": boolean }
 */
export const rateTutorial = async (req, res) => {
  try {
    const userId = req.user?.id;
    const tutorialId = Number(req.params.id);
    const { isLiked } = req.body;

    if (!userId) return res.status(401).json({ success: false, message: 'Non authentifié' });
    if (!Number.isInteger(tutorialId)) return res.status(400).json({ success: false, message: 'ID tutoriel invalide' });
    if (typeof isLiked !== 'boolean') return res.status(400).json({ success: false, message: 'isLiked doit être un booléen' });

    const result = await ratingService.rateTutorial(userId, tutorialId, isLiked);
    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    if (error.message === 'Tutoriel introuvable' || error.message === 'Tutorial not found') {
      return res.status(404).json({ success: false, message: 'Tutoriel introuvable' });
    }
    console.error('❌ rateTutorial:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la notation du tutoriel' });
  }
};

/**
 * GET /api/ratings/users/:id/ratings
 * Liste des évaluations reçues par un utilisateur (public)
 */
export const getUserRatings = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) return res.status(400).json({ success: false, message: 'ID utilisateur invalide' });

    const rows = await ratingService.getUserRatings(userId);
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error('❌ getUserRatings:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors de la récupération des évaluations' });
  }
};

/**
 * GET /api/ratings/users/:id/rating
 * Moyenne et nombre de notes reçues par un utilisateur (public)
 */
export const getUserRating = async (req, res) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId)) return res.status(400).json({ success: false, message: 'ID utilisateur invalide' });

    const row = await ratingService.getUserRating(userId);
    return res.status(200).json({ success: true, data: row }); // { count, average }
  } catch (error) {
    console.error('❌ getUserRating:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors du calcul de la note utilisateur' });
  }
};

/**
 * GET /api/ratings/tutorials/:id/ratings
 * Stats likes/dislikes d’un tutoriel (public)
 */
export const getTutorialRating = async (req, res) => {
  try {
    const tutorialId = Number(req.params.id);
    if (!Number.isInteger(tutorialId)) return res.status(400).json({ success: false, message: 'ID tutoriel invalide' });

    const row = await ratingService.getTutorialRating(tutorialId);
    return res.status(200).json({ success: true, data: row }); // { likes, dislikes, total }
  } catch (error) {
    console.error('❌ getTutorialRating:', error);
    return res.status(500).json({ success: false, message: 'Erreur lors du calcul des likes/dislikes' });
  }
};