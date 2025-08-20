import { userService } from '../services/userService.js';
import { skillService } from '../services/skillService.js';
/**
 * Récupérer le profil public d'un utilisateur
 * GET /api/users/profile/:id
 */
export const getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validation ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: 'ID utilisateur invalide'
      });
    }

    const user = await userService.getUserById(parseInt(id));
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profil récupéré avec succès',
      user
    });

  } catch (error) {
    console.error('❌ Erreur getPublicProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};

/**
 * Mettre à jour son profil utilisateur
 * PUT /api/users/profile
 * Route protégée (authMiddleware requis)
 */
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Vient du middleware auth
    const updateData = req.body;

    // Validation des données (basique)
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucune donnée à mettre à jour'
      });
    }

    const updatedUser = await userService.updateUserProfile(userId, updateData);

    res.status(200).json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: updatedUser
    });

  } catch (error) {
    console.error('❌ Erreur updateProfile:', error);
    
    // Gestion erreurs spécifiques du service
    if (error.message === 'Cet email est déjà utilisé') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'Ce nom d\'utilisateur est déjà pris') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du profil'
    });
  }
};

/**
 * Supprimer son compte utilisateur
 * DELETE /api/users/profile
 * Route protégée (authMiddleware requis)
 */
export const deleteProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Vient du middleware auth

    await userService.deleteUserAccount(userId);

    res.status(200).json({
      success: true,
      message: 'Compte supprimé avec succès. Vos données ont été définitivement effacées.'
    });

  } catch (error) {
    console.error('❌ Erreur deleteProfile:', error);
    
    // Gestion erreur contrainte FK (relations existantes)
    if (error.message === 'Impossible de supprimer : des données liées existent encore') {
      return res.status(409).json({
        success: false,
        message: 'Impossible de supprimer le compte : des tutoriels ou commentaires sont encore associés. Contactez le support.'
      });
    }
    
    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({
        success: false,
        message: 'Compte utilisateur non trouvé'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du compte'
    });
  }
};

/**
 * Récupérer des profils exemple pour la landing page
 * GET /api/users/examples
 * Route publique
 */
export const getExampleProfiles = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    // Validation limit
    if (limit > 20) {
      return res.status(400).json({
        success: false,
        message: 'Limite maximum : 20 profils'
      });
    }

    const users = await userService.getUsersForLanding(limit);

    res.status(200).json({
      success: true,
      message: 'Profils exemple récupérés avec succès',
      users,
      count: users.length
    });

  } catch (error) {
    console.error('❌ Erreur getExampleProfiles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des profils exemple'
    });
  }
};


import { skillService } from '../services/skillService.js';

/**
 * Ajouter une compétence à l'utilisateur connecté
 * POST /api/users/skills
 * Route protégée (authMiddleware requis)
 */
export const addUserSkill = async (req, res) => {
  try {
    const userId = req.user.id; // Vient du middleware auth
    const { skillId } = req.body;

    // Validation skillId
    if (!skillId || isNaN(parseInt(skillId))) {
      return res.status(400).json({
        success: false,
        message: 'ID de compétence invalide'
      });
    }

    const result = await skillService.addSkillToUser(userId, parseInt(skillId));

    res.status(201).json({
      success: true,
      message: result.message,
      skill: {
        id: result.id,
        name: result.name
      }
    });

  } catch (error) {
    console.error('❌ Erreur addUserSkill:', error);
    
    // Gestion erreurs spécifiques du service
    if (error.message === 'Compétence non trouvée') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'Cette compétence est déjà associée à votre profil') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de la compétence'
    });
  }
};

/**
 * Retirer une compétence de l'utilisateur connecté
 * DELETE /api/users/skills/:skillId
 * Route protégée (authMiddleware requis)
 */
export const removeUserSkill = async (req, res) => {
  try {
    const userId = req.user.id; // Vient du middleware auth
    const { skillId } = req.params;

    // Validation skillId
    if (!skillId || isNaN(parseInt(skillId))) {
      return res.status(400).json({
        success: false,
        message: 'ID de compétence invalide'
      });
    }

    await skillService.removeSkillFromUser(userId, parseInt(skillId));

    res.status(200).json({
      success: true,
      message: 'Compétence retirée avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur removeUserSkill:', error);
    
    if (error.message === 'Compétence non trouvée dans votre profil') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de la compétence'
    });
  }
};

/**
 * Ajouter un intérêt à l'utilisateur connecté
 * POST /api/users/interests
 * Route protégée (authMiddleware requis)
 */
export const addUserInterest = async (req, res) => {
  try {
    const userId = req.user.id; // Vient du middleware auth
    const { skillId } = req.body;

    // Validation skillId
    if (!skillId || isNaN(parseInt(skillId))) {
      return res.status(400).json({
        success: false,
        message: 'ID de compétence invalide'
      });
    }

    const result = await skillService.addInterestToUser(userId, parseInt(skillId));

    res.status(201).json({
      success: true,
      message: result.message,
      interest: {
        id: result.id,
        name: result.name
      }
    });

  } catch (error) {
    console.error('❌ Erreur addUserInterest:', error);
    
    // Gestion erreurs spécifiques du service
    if (error.message === 'Compétence non trouvée') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    if (error.message === 'Cet intérêt est déjà associé à votre profil') {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout de l\'intérêt'
    });
  }
};

/**
 * Retirer un intérêt de l'utilisateur connecté
 * DELETE /api/users/interests/:skillId
 * Route protégée (authMiddleware requis)
 */
export const removeUserInterest = async (req, res) => {
  try {
    const userId = req.user.id; // Vient du middleware auth
    const { skillId } = req.params;

    // Validation skillId
    if (!skillId || isNaN(parseInt(skillId))) {
      return res.status(400).json({
        success: false,
        message: 'ID de compétence invalide'
      });
    }

    await skillService.removeInterestFromUser(userId, parseInt(skillId));

    res.status(200).json({
      success: true,
      message: 'Intérêt retiré avec succès'
    });

  } catch (error) {
    console.error('❌ Erreur removeUserInterest:', error);
    
    if (error.message === 'Intérêt non trouvé dans votre profil') {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'intérêt'
    });
  }
};