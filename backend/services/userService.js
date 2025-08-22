import { User, Skill, Category } from '../models/index.js';
import { Op } from 'sequelize';

export const userService = {
  /**
   * Récupérer un utilisateur par ID avec ses relations (profil public)
   * @param {number} id - ID de l'utilisateur
   * @returns {Object|null} Utilisateur avec skills/interests ou null
   */
  async getUserById(id) {
    try {
      const user = await User.findOne({
        where: { user_id: id },
        attributes: { 
          exclude: ['password'] // Exclure le mot de passe
        },
        include: [
          {
            association: 'skills',
            through: { attributes: [] }, // Exclure les données de la table de liaison
            include: [{
              association: 'category',
              attributes: ['category_id', 'title']
            }]
          },
          {
            association: 'interests',
            through: { attributes: [] },
            include: [{
              association: 'category',
              attributes: ['category_id', 'title']
            }]
          }
        ]
      });

      if (!user) {
        return null;
      }

      // Mapping cohérent avec authController
      return {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        content: user.content,
        birthdate: user.birthdate,
        gender: user.gender,
        profilePicture: user.profile_picture,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        skills: user.skills?.map(skill => ({
          id: skill.skill_id,
          name: skill.title,
          category: skill.category
        })) || [],
        interests: user.interests?.map(interest => ({
          id: interest.skill_id,
          name: interest.title,
          category: interest.category
        })) || []
      };

    } catch (error) {
      console.error('❌ Erreur getUserById:', error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  },

  /**
   * Mettre à jour le profil utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {Object} updateData - Données à mettre à jour
   * @returns {Object} Utilisateur mis à jour
   */
  async updateUserProfile(userId, updateData) {
    try {
      // Mapping des champs autorisés (cohérent avec le modèle)
      const allowedFields = {};
      
      if (updateData.firstName) allowedFields.first_name = updateData.firstName;
      if (updateData.lastName) allowedFields.last_name = updateData.lastName;
      if (updateData.username) allowedFields.username = updateData.username;
      if (updateData.email) allowedFields.email = updateData.email;
      if (updateData.content) allowedFields.content = updateData.content;
      if (updateData.gender !== undefined) allowedFields.gender = updateData.gender;
      
      // Mise à jour automatique du timestamp
      allowedFields.updated_at = new Date();

      // Validation unicité email (comme dans authController)
      if (updateData.email) {
        const existingEmail = await User.findOne({ 
          where: { 
            email: updateData.email,
            user_id: { [Op.ne]: userId } // Exclure l'utilisateur actuel
          } 
        });
        if (existingEmail) {
          throw new Error('Cet email est déjà utilisé');
        }
      }

      // Validation unicité username (comme dans authController)
      if (updateData.username) {
        const existingUsername = await User.findOne({ 
          where: { 
            username: updateData.username,
            user_id: { [Op.ne]: userId }
          } 
        });
        if (existingUsername) {
          throw new Error('Ce nom d\'utilisateur est déjà pris');
        }
      }

      // Mise à jour
      const [affectedRows] = await User.update(allowedFields, {
        where: { user_id: userId }
      });

      if (affectedRows === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      // Récupérer l'utilisateur mis à jour
      const updatedUser = await User.findOne({
        where: { user_id: userId },
        attributes: { exclude: ['password'] }
      });

      // Mapping cohérent
      return {
        id: updatedUser.user_id,
        email: updatedUser.email,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        username: updatedUser.username,
        content: updatedUser.content,
        birthdate: updatedUser.birthdate,
        gender: updatedUser.gender,
        profilePicture: updatedUser.profile_picture,
        createdAt: updatedUser.created_at,
        updatedAt: updatedUser.updated_at
      };

    } catch (error) {
      console.error('❌ Erreur updateUserProfile:', error);
      throw error;
    }
  },

  /**
   * Supprimer le compte utilisateur (Hard Delete)
   * @param {number} userId - ID de l'utilisateur à supprimer
   * @returns {boolean} Succès de la suppression
   */
  async deleteUserAccount(userId) {
    try {
      const deletedRows = await User.destroy({
        where: { user_id: userId }
      });

      if (deletedRows === 0) {
        throw new Error('Utilisateur non trouvé');
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur deleteUserAccount:', error);
      
      // Gestion erreur contrainte FK
      if (error.name === 'SequelizeForeignKeyConstraintError') {
        throw new Error('Impossible de supprimer : des données liées existent encore');
      }
      
      throw error;
    }
  },

  /**
   * Récupérer des profils exemple pour la landing page
   * @param {number} limit - Nombre de profils à récupérer
   * @returns {Array} Liste des profils exemple
   */
  async getUsersForLanding(limit = 6) {
    try {
      const users = await User.findAll({
        limit,
        attributes: { 
          exclude: ['password', 'email'] // Exclure données sensibles
        },
        include: [
          {
            association: 'skills',
            through: { attributes: [] },
            include: [{
              association: 'category',
              attributes: ['title']
            }]
          }
        ],
        order: [['created_at', 'DESC']] // Les plus récents en premier
      });

      return users.map(user => ({
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        content: user.content,
        profilePicture: user.profile_picture,
        skills: user.skills?.map(skill => ({
          id: skill.skill_id,
          name: skill.title,
          category: skill.category?.title
        })) || []
      }));

    } catch (error) {
      console.error('❌ Erreur getUsersForLanding:', error);
      throw new Error('Erreur lors de la récupération des profils exemple');
    }
  }
};