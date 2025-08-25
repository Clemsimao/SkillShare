import { Conversation, User } from '../models/index.js';
import { Op } from 'sequelize';

/**
 * =====================================================
 * CONVERSATION SERVICE - Gestion des conversations entre utilisateurs
 * =====================================================
 * 
 * Fonctionnalités principales :
 * - Création/récupération conversations avec logique user1_id < user2_id
 * - Gestion contrainte UNIQUE pour éviter doublons (Fab↔Clem = Clem↔Fab)
 * - Récupération conversations utilisateur triées par activité récente
 * - Mise à jour timestamps last_message_at pour tri optimal
 * 
 * Logique métier clé :
 * - Math.min/max pour forcer ordre user1_id < user2_id systématiquement
 * - Gestion erreurs UNIQUE constraint (récupère existante si doublon)
 * - Mapping "otherParticipant" pour identifier l'interlocuteur
 * 
 * Architecture :
 * - Pattern cohérent avec userService (JSDoc, try/catch, mapping camelCase)
 * - Validation existence utilisateurs avant création
 * - Helper methods pour associations et réutilisabilité
 * =====================================================
 */


export const conversationService = {
  /**
   * Créer ou récupérer une conversation entre 2 utilisateurs
   * Gère automatiquement l'ordre user1_id < user2_id pour éviter les doublons
   * @param {number} userAId - ID du premier utilisateur  
   * @param {number} userBId - ID du deuxième utilisateur
   * @returns {Object} Conversation avec informations des participants
   */
  async createOrGetConversation(userAId, userBId) {
    try {
      // Validation des paramètres
      if (!userAId || !userBId) {
        throw new Error('Les IDs des utilisateurs sont requis');
      }

      if (userAId === userBId) {
        throw new Error('Un utilisateur ne peut pas créer une conversation avec lui-même');
      }

      // Forcer l'ordre user1_id < user2_id (logique métier importante)
      const user1_id = Math.min(userAId, userBId);
      const user2_id = Math.max(userAId, userBId);

      // Vérifier que les utilisateurs existent
      const usersExist = await User.count({
        where: {
          user_id: { [Op.in]: [user1_id, user2_id] }
        }
      });

      if (usersExist !== 2) {
        throw new Error('Un ou plusieurs utilisateurs n\'existent pas');
      }

      try {
        // Tentative de création de la conversation
        const newConversation = await Conversation.create({
          user1_id,
          user2_id
        });

        // Récupérer avec les relations pour retour cohérent
        return await this.getConversationWithParticipants(newConversation.conversation_id);

      } catch (creationError) {
        // Si erreur UNIQUE constraint, récupérer l'existante
        if (creationError.name === 'SequelizeUniqueConstraintError') {
          const existingConversation = await Conversation.findOne({
            where: { user1_id, user2_id }
          });

          if (existingConversation) {
            return await this.getConversationWithParticipants(existingConversation.conversation_id);
          }
        }

        // Autre erreur : la relancer
        throw creationError;
      }

    } catch (error) {
      console.error('❌ Erreur createOrGetConversation:', error);
      throw error;
    }
  },

  /**
   * Récupérer toutes les conversations d'un utilisateur
   * Triées par activité récente (last_message_at DESC)
   * @param {number} userId - ID de l'utilisateur
   * @returns {Array} Liste des conversations avec participants
   */
  async getConversationsByUser(userId) {
    try {
      if (!userId) {
        throw new Error('L\'ID utilisateur est requis');
      }

      const conversations = await Conversation.findAll({
        where: {
          [Op.or]: [
            { user1_id: userId },
            { user2_id: userId }
          ]
        },
        include: [
          {
            association: 'participant1', // user1
            attributes: { exclude: ['password'] } // Pas d'infos sensibles
          },
          {
            association: 'participant2', // user2  
            attributes: { exclude: ['password'] }
          }
        ],
        order: [['last_message_at', 'DESC']] // Plus récentes en premier
      });

      // Mapping cohérent camelCase 
      return conversations.map(conversation => ({
        id: conversation.conversation_id,
        createdAt: conversation.created_at,
        lastMessageAt: conversation.last_message_at,
        // Participant qui n'est PAS l'utilisateur actuel (l'autre personne)
        otherParticipant: userId === conversation.user1_id 
          ? {
              id: conversation.participant2.user_id,
              firstName: conversation.participant2.first_name,
              lastName: conversation.participant2.last_name,
              username: conversation.participant2.username,
              profilePicture: conversation.participant2.profile_picture
            }
          : {
              id: conversation.participant1.user_id,  
              firstName: conversation.participant1.first_name,
              lastName: conversation.participant1.last_name,
              username: conversation.participant1.username,
              profilePicture: conversation.participant1.profile_picture
            }
      }));

    } catch (error) {
      console.error('❌ Erreur getConversationsByUser:', error);
      throw error; // Relancer l'erreur originale pour tests précis
    }
  },

  /**
   * Mettre à jour le timestamp last_message_at d'une conversation
   * Appelé automatiquement quand un nouveau message est envoyé
   * @param {number} conversationId - ID de la conversation
   * @returns {boolean} Succès de la mise à jour
   */
  async updateLastMessageAt(conversationId) {
    try {
      if (!conversationId) {
        throw new Error('L\'ID de conversation est requis');
      }

      const [affectedRows] = await Conversation.update(
      { last_message_at: new Date() }, // Utiliser new Date() comme userService
      { 
        where: { conversation_id: conversationId },
        validate: false  // Désactiver validations pour UPDATE simple
      }
    );

      if (affectedRows === 0) {
        throw new Error('Conversation non trouvée');
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur updateLastMessageAt:', error);
      throw error;
    }
  },

  /**
   * Méthode helper pour récupérer une conversation avec ses participants
   * @param {number} conversationId - ID de la conversation
   * @returns {Object} Conversation complète
   */
  async getConversationWithParticipants(conversationId) {
    try {
      const conversation = await Conversation.findOne({
        where: { conversation_id: conversationId },
        include: [
          {
            association: 'participant1',
            attributes: { exclude: ['password'] }
          },
          {
            association: 'participant2', 
            attributes: { exclude: ['password'] }
          }
        ]
      });

      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      // Mapping cohérent
      return {
        id: conversation.conversation_id,
        createdAt: conversation.created_at,
        lastMessageAt: conversation.last_message_at,
        participants: [
          {
            id: conversation.participant1.user_id,
            firstName: conversation.participant1.first_name,
            lastName: conversation.participant1.last_name,
            username: conversation.participant1.username,
            profilePicture: conversation.participant1.profile_picture
          },
          {
            id: conversation.participant2.user_id,
            firstName: conversation.participant2.first_name, 
            lastName: conversation.participant2.last_name,
            username: conversation.participant2.username,
            profilePicture: conversation.participant2.profile_picture
          }
        ]
      };

    } catch (error) {
      console.error('❌ Erreur getConversationWithParticipants:', error);
      throw error;
    }
  }
};