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

    // VALIDATION CONTENT 
    if (updateData.content !== undefined) {
      if (typeof updateData.content !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'La description doit être du texte'
        });
      }

      if (updateData.content.length > 255) {
        return res.status(400).json({
          success: false,
          message: 'La description ne peut pas dépasser 255 caractères'
        });
      }

      // Convertir une description vide en null pour la base de données
      // Évite d'avoir des strings vides "" et privilégie null (plus propre) 
      if (updateData.content.trim().length === 0) {
        updateData.content = null;
      }
    }

    // VALIDATION LOCATION
    if (updateData.location !== undefined) {
      if (typeof updateData.location !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'La localisation doit être du texte'
        });
      }

      if (updateData.location.length > 100) {
        return res.status(400).json({
          success: false,
          message: 'La localisation ne peut pas dépasser 100 caractères'
        });
      }

      if (updateData.location.trim().length === 0) {
        updateData.location = null;
      }
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
 * Upload / mettre à jour la photo de profil
 * POST /api/users/profile/picture
 * Route protégée (authMiddleware requis)
 * Body: form-data -> field "avatar" (type File)
 */
import cloudinary from '../config/cloudinary.js';
// ...

/**
 * Upload / mettre à jour la photo de profil
 * POST /api/users/profile/picture
 * Route protégée (authMiddleware requis)
 * Body: form-data -> field "avatar" (type File)
 */
export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // Avec memoryStorage, le fichier est dans req.file.buffer
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        success: false,
        message: 'Aucun fichier reçu'
      });
    }

    // Fonction interne pour transformer le buffer en Promise d'upload
    const uploadToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'skillshare/avatars',
            resource_type: 'image',
            format: 'webp',
            transformation: [{ width: 512, height: 512, crop: 'fill', gravity: 'face' }]
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(buffer);
      });
    };

    const result = await uploadToCloudinary(req.file.buffer);

    const updatedUser = await userService.updateUserProfile(userId, {
      profile_picture: result.secure_url
    });

    return res.status(200).json({
      success: true,
      message: 'Photo de profil mise à jour',
      url: result.secure_url
    });

  } catch (error) {
    console.error('❌ Erreur uploadProfilePicture:', error);

    if (error.message === 'Utilisateur non trouvé') {
      return res.status(404).json({ success: false, message: error.message });
    }

    return res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de la photo de profil'
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
        title: result.title  // ✅ CORRIGÉ : "title" au lieu de "name"
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
        title: result.title  // ✅ CORRIGÉ : "title" au lieu de "name"
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