import { User, Tutorial, UserRating, TutorialRating } from '../models/index.js';
import { Op, fn, col, literal } from 'sequelize';

export const ratingService = {
  /**
   * Noter un utilisateur (1–5) 
   * @param {number} evaluatorId 
   * @param {number} evaluatedId 
   * @param {number} rating 
   */
  async rateUser(evaluatorId, evaluatedId, rating) {
    try {
      // Vérifie que l'utilisateur est bien authentifié et que la note est valide
      if (!evaluatorId) throw new Error('Non authentifié');
      if (!evaluatedId) throw new Error('Utilisateur évalué invalide');
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
        throw new Error('La note doit être un entier entre 1 et 5');
      }
      if (evaluatorId === evaluatedId) {
        throw new Error('Vous ne pouvez pas vous noter vous-même');
      }

      // Vérifie que l'utilisateur évalué existe dans la base
      // Vérifier que l'évalué existe
      const target = await User.findOne({ where: { user_id: evaluatedId }, attributes: ['user_id'] });
      if (!target) throw new Error('Utilisateur évalué introuvable');

      // Crée ou met à jour la note dans la table user_ratings
      const [row] = await UserRating.upsert(
        {
          evaluator_id: evaluatorId,
          evaluated_id: evaluatedId,
          rating,
          updated_at: new Date()
        },
        { returning: true }
      );

      // Retourne un objet formaté avec les informations principales
      return {
        evaluatorId: row.evaluator_id,
        evaluatedId: row.evaluated_id,
        rating: row.rating,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('❌ Erreur rateUser:', error);
      throw error;
    }
  },

  /**
   * Like / Dislike un tutoriel 
   * @param {number} userId 
   * @param {number} tutorialId 
   * @param {boolean} isLiked 
   */
  async rateTutorial(userId, tutorialId, isLiked) {
    try {
      // Vérifie que l'utilisateur est connecté, que l'id du tutoriel est valide et que isLiked est un booléen
      if (!userId) throw new Error('Non authentifié');
      if (!tutorialId) throw new Error('Tutoriel invalide');
      if (typeof isLiked !== 'boolean') throw new Error('isLiked doit être un booléen');

      // Vérifie que le tutoriel existe dans la base
      const tuto = await Tutorial.findOne({ where: { tutorial_id: tutorialId }, attributes: ['tutorial_id'] });
      if (!tuto) throw new Error('Tutoriel introuvable');

      // Crée ou met à jour l'évaluation (like/dislike) du tutoriel
      const [row] = await TutorialRating.upsert(
        {
          user_id: userId,
          tutorial_id: tutorialId,
          is_liked: isLiked,
          updated_at: new Date()
        },
        { returning: true }
      );

      // Retourne un objet formaté avec les informations principales
      return {
        userId: row.user_id,
        tutorialId: row.tutorial_id,
        isLiked: row.is_liked,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      };
    } catch (error) {
      console.error('❌ Erreur rateTutorial:', error);
      throw error;
    }
  },

  /**
   * Moyenne des notes reçues par un utilisateur
   * @param {number} userId
   * @returns {{count:number, average:number}}
   */
  async getUserRating(userId) {
    try {
      // Exécute une requête d'agrégation pour calculer la moyenne et le nombre de notes
      const result = await UserRating.findAll({
        where: { evaluated_id: userId },
        attributes: [
          [fn('COUNT', col('rating')), 'count'],
          // arrondir à 2 décimales ; COALESCE à 0 si aucun vote
          [literal("COALESCE(ROUND(AVG(rating)::numeric, 2), 0)"), 'average']
        ],
        raw: true
      });

      // Normalise les résultats en nombres et retourne un objet { count, average }
      // Sequelize renvoie un tableau avec une ligne d’agrégats
      // On normalise les types (number)
      const row = result[0] || { count: 0, average: 0 };
      return {
        count: Number(row.count) || 0,
        average: Number(row.average) || 0
      };
    } catch (error) {
      console.error('❌ Erreur getUserRating:', error);
      throw new Error('Erreur lors du calcul de la note utilisateur');
    }
  },

  /**
   * Toutes les évaluations reçues par un utilisateur (sans rely sur des alias d'associations)
   * 1) récupère les lignes dans user_ratings
   * 2) récupère les évaluateurs via une requête séparée sur User
   * 3) merge les données pour un retour propre
   */
  async getUserRatings(userId) {
    try {
      // 1) Récupère les notes reçues (brut)
      const ratings = await UserRating.findAll({
        where: { evaluated_id: userId },
        order: [['created_at', 'DESC']],
        raw: true // renvoie des objets simples { evaluator_id, evaluated_id, rating, created_at, ... }
      });

      if (!ratings.length) return [];

      // 2) Récupère les infos des évaluateurs en un seul appel
      const evaluatorIds = [...new Set(ratings.map(r => r.evaluator_id))];
      const evaluators = await User.findAll({
        where: { user_id: evaluatorIds },
        attributes: ['user_id', 'username', 'profile_picture'],
        raw: true
      });

      // Construire un index par id pour lookup rapide
      const byId = new Map(evaluators.map(u => [u.user_id, u]));

      // 3) Merge et formatage de la réponse
      return ratings.map(r => {
        const u = byId.get(r.evaluator_id);
        return {
          evaluator: u ? {
            id: u.user_id,
            username: u.username,
            profilePicture: u.profile_picture
          } : {
            id: r.evaluator_id,
            username: null,
            profilePicture: null
          },
          rating: r.rating,
          createdAt: r.created_at
        };
      });
    } catch (error) {
      console.error('❌ Erreur getUserRatings:', error);
      throw new Error('Erreur lors de la récupération des évaluations');
    }
  },

  /**
   * Stats likes/dislikes d’un tutoriel
   * @param {number} tutorialId
   * @returns {{likes:number, dislikes:number, total:number}}
   */
  async getTutorialRating(tutorialId) {
    try {
      // Compte séparément les likes et dislikes du tutoriel
      const [likes, dislikes] = await Promise.all([
        TutorialRating.count({ where: { tutorial_id: tutorialId, is_liked: true } }),
        TutorialRating.count({ where: { tutorial_id: tutorialId, is_liked: false } })
      ]);

      // Retourne un objet contenant le nombre de likes, de dislikes et le total
      return { likes, dislikes, total: likes + dislikes };
    } catch (error) {
      console.error('❌ Erreur getTutorialRating:', error);
      throw new Error('Erreur lors du calcul des likes/dislikes');
    }
  }
};