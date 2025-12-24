import { searchService } from '../services/searchService.js';

/*
 * ============================================================================
 * SÉCURITÉ RENFORCÉE - VALIDATIONS COMPLÈTES
 * ============================================================================
 * 
 * Ce controller applique des validations plus strictes que les autres 
 * controllers existants pour des raisons de sécurité critiques :
 * 
 * 1. PROTECTION DOS : Limite max pour éviter crash serveur (limit > 50)
 * 2. PAGINATION ROBUSTE : Validation page >= 1 pour éviter bugs Sequelize
 * 3. ERREURS CLAIRES : Messages précis pour meilleure UX frontend
 * 
 * POURQUOI PLUS STRICT QUE LES AUTRES ?
 * - Les endpoints de recherche sont + vulnérables (pagination, grandes datasets)
 * - Ce controller sert de RÉFÉRENCE SÉCURITÉ pour futurs développements
 * - Coût négligeable vs protection production
 * 
 * TODO ÉQUIPE : Harmoniser progressivement les autres controllers avec ce niveau
 * ============================================================================
 */

/**
 * Recherche d'utilisateurs par compétence ou catégorie
 * GET /api/search/users?skillId=5&page=1&limit=10
 * GET /api/search/users?categoryId=2&page=1
 * Route protégée (authMiddleware requis)
 */
export const searchUsers = async (req, res) => {
  try {
    // EXTRACTION DES PARAMÈTRES : Récupérer les query params de l'URL
    const { skillId, categoryId, q, page, limit } = req.query;
    console.log('🔍 SEARCH USERS REQUEST:', { skillId, categoryId, q, page, limit });

    // VALIDATION PARAMÈTRES : Au moins un critère de recherche requis
    // if (!skillId && !categoryId && !q) { ... } -> RELAXED for "Show All"


    // VALIDATION TYPES : Vérifier que les IDs sont des nombres
    if (skillId && isNaN(parseInt(skillId))) {
      return res.status(400).json({
        success: false,
        message: 'skillId doit être un nombre valide'
      });
    }

    if (categoryId && isNaN(parseInt(categoryId))) {
      return res.status(400).json({
        success: false,
        message: 'categoryId doit être un nombre valide'
      });
    }

    // CONVERSION EN ENTIERS
    const searchParams = {
      skillId: skillId ? parseInt(skillId) : null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      q: q || null,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };

    // VALIDATION PAGINATION
    if (searchParams.page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de page doit être supérieur à 0'
      });
    }

    if (searchParams.limit < 1 || searchParams.limit > 50) {
      return res.status(400).json({
        success: false,
        message: 'La limite doit être entre 1 et 50'
      });
    }

    // APPEL DU SERVICE
    const results = await searchService.searchUsers(searchParams);

    // RÉPONSE SUCCÈS
    res.status(200).json({
      success: true,
      message: `${results.data.length} utilisateur(s) trouvé(s)`,
      users: results.data,
      pagination: results.pagination
    });

  } catch (error) {
    console.error('❌ Erreur searchUsers controller:', error);

    if (error.message.includes('requis')) { // Catch generic required error
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche d\'utilisateurs'
    });
  }
};

/**
 * Recherche de tutoriels par compétence ou catégorie
 * GET /api/search/tutorials?skillId=5&page=1
 * GET /api/search/tutorials?categoryId=2&page=1&limit=15
 * Route protégée (authMiddleware requis)
 */
export const searchTutorials = async (req, res) => {
  try {
    // EXTRACTION DES PARAMÈTRES
    const { skillId, categoryId, q, page, limit } = req.query;

    // VALIDATION PARAMÈTRES
    // if (!skillId && !categoryId && !q) { ... } -> RELAXED


    // VALIDATION TYPES
    if (skillId && isNaN(parseInt(skillId))) {
      return res.status(400).json({
        success: false,
        message: 'skillId doit être un nombre valide'
      });
    }

    if (categoryId && isNaN(parseInt(categoryId))) {
      return res.status(400).json({
        success: false,
        message: 'categoryId doit être un nombre valide'
      });
    }

    // CONVERSION EN ENTIERS
    const searchParams = {
      skillId: skillId ? parseInt(skillId) : null,
      categoryId: categoryId ? parseInt(categoryId) : null,
      q: q || null,
      page: page ? parseInt(page) : 1,
      limit: limit ? parseInt(limit) : 10
    };

    // VALIDATION PAGINATION : Valeurs cohérentes
    if (searchParams.page < 1) {
      return res.status(400).json({
        success: false,
        message: 'Le numéro de page doit être supérieur à 0'
      });
    }

    if (searchParams.limit < 1 || searchParams.limit > 50) {
      return res.status(400).json({
        success: false,
        message: 'La limite doit être entre 1 et 50'
      });
    }

    // APPEL DU SERVICE : Déléguer au service tutorials
    const results = await searchService.searchTutorials(searchParams);

    // RÉPONSE SUCCÈS : Format cohérent avec searchUsers
    res.status(200).json({
      success: true,
      message: `${results.data.length} tutoriel(s) trouvé(s)`,
      tutorials: results.data,       // Liste des tutoriels
      pagination: results.pagination  // Infos pagination
    });

  } catch (error) {
    console.error('❌ Erreur searchTutorials controller:', error);


    if (error.message === 'skillId ou categoryId requis') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la recherche de tutoriels'
    });
  }
};