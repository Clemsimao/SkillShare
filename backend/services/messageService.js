import { Message, Conversation, User } from '../models/index.js';
import { conversationService } from './conversationService.js';
import { Op } from 'sequelize';

/**
 * =====================================================
 * MESSAGE SERVICE - Gestion des messages de conversation
 * =====================================================
 * 
 * Fonctionnalités principales :
 * - Création de messages avec validation sécurité (participation conversation)
 * - Récupération avec pagination et tri chronologique
 * - Système de lecture (is_read) uniquement pour messages reçus
 * - Compteur messages non lus pour notifications
 * - Mise à jour automatique last_message_at via conversationService
 * 
 * Sécurité :
 * - Vérification participation utilisateur dans conversation
 * - Exclusion données sensibles (password)
 * - Validation paramètres obligatoires
 * 
 * Architecture :
 * - Pattern cohérent avec userService (JSDoc, try/catch, mapping camelCase)
 * - Intégration avec conversationService pour timestamps
 * - Helper methods pour réutilisabilité
 * =====================================================
 */


export const messageService = {
  /**
   * Créer un nouveau message dans une conversation
   * Met automatiquement à jour le last_message_at de la conversation
   * @param {number} conversationId - ID de la conversation
   * @param {number} senderId - ID de l'expéditeur  
   * @param {string} content - Contenu du message
   * @returns {Object} Message créé avec informations de l'expéditeur
   */
  async createMessage(conversationId, senderId, content) {
    try {
      // Validation des paramètres
      if (!conversationId || !senderId || !content) {
        throw new Error('Les paramètres conversationId, senderId et content sont requis');
      }

      // Vérifier que la conversation existe
      const conversation = await Conversation.findByPk(conversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      // Vérifier que l'expéditeur est participant de la conversation
      if (conversation.user1_id !== senderId && conversation.user2_id !== senderId) {
        throw new Error('L\'utilisateur n\'est pas autorisé à envoyer des messages dans cette conversation');
      }

      // Vérifier que l'expéditeur existe
      const sender = await User.findByPk(senderId);
      if (!sender) {
        throw new Error('Expéditeur non trouvé');
      }

      // Créer le message
      const newMessage = await Message.create({
        conversation_id: conversationId,
        sender_id: senderId,
        content: content.trim(), // Nettoyer le contenu
        sent_at: new Date(),
        is_read: false // Nouveau message = non lu
      });

      // Mettre à jour le timestamp de la conversation (activité récente)
      await conversationService.updateLastMessageAt(conversationId);

      // Récupérer le message avec les informations de l'expéditeur
      return await this.getMessageWithSender(newMessage.message_id);

    } catch (error) {
      console.error('❌ Erreur createMessage:', error);
      throw error;
    }
  },

  /**
   * Récupérer les messages d'une conversation avec pagination
   * Triés par ordre chronologique (plus anciens en premier)
   * @param {number} conversationId - ID de la conversation
   * @param {Object} options - Options de pagination et filtrage
   * @param {number} options.page - Page courante (défaut: 1)
   * @param {number} options.limit - Messages par page (défaut: 50)
   * @param {number} options.userId - ID utilisateur pour vérifier l'accès
   * @returns {Object} Messages avec pagination
   */
  async getMessagesByConversation(conversationId, options = {}) {
    try {
      const { page = 1, limit = 50, userId } = options;

      if (!conversationId) {
        throw new Error('L\'ID de conversation est requis');
      }

      // Vérifier que la conversation existe et que l'utilisateur y a accès
      if (userId) {
        const conversation = await Conversation.findByPk(conversationId);
        if (!conversation) {
          throw new Error('Conversation non trouvée');
        }

        // Vérifier que l'utilisateur est participant
        if (conversation.user1_id !== userId && conversation.user2_id !== userId) {
          throw new Error('Accès non autorisé à cette conversation');
        }
      }

      // Calcul pagination
      const offset = (page - 1) * limit;

      // Récupération des messages avec informations expéditeur
      const { count, rows: messages } = await Message.findAndCountAll({
        where: { conversation_id: conversationId },
        include: [
          {
            association: 'sender',
            attributes: { exclude: ['password'] } // Pas d'infos sensibles
          }
        ],
        order: [['sent_at', 'ASC']], // Ordre chronologique (plus ancien en premier)
        limit,
        offset
      });

      // Mapping cohérent camelCase (comme les autres services)
      const mappedMessages = messages.map(message => ({
        id: message.message_id,
        conversationId: message.conversation_id,
        content: message.content,
        sentAt: message.sent_at,
        isRead: message.is_read,
        sender: {
          id: message.sender.user_id,
          firstName: message.sender.first_name,
          lastName: message.sender.last_name,
          username: message.sender.username,
          profilePicture: message.sender.profile_picture
        }
      }));

      return {
        messages: mappedMessages,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit),
          hasNext: page * limit < count,
          hasPrev: page > 1
        }
      };

    } catch (error) {
      console.error('❌ Erreur getMessagesByConversation:', error);
      throw error;
    }
  },

  /**
   * Marquer des messages comme lus par un utilisateur
   * Seuls les messages reçus (pas envoyés) peuvent être marqués comme lus
   * @param {Array|number} messageIds - ID(s) des messages à marquer comme lus
   * @param {number} userId - ID de l'utilisateur qui lit les messages
   * @returns {number} Nombre de messages marqués comme lus
   */
  async markAsRead(messageIds, userId) {
    try {
      if (!messageIds || !userId) {
        throw new Error('Les paramètres messageIds et userId sont requis');
      }

      // Normaliser messageIds en tableau
      const idsArray = Array.isArray(messageIds) ? messageIds : [messageIds];

      if (idsArray.length === 0) {
        return 0;
      }

      // Marquer comme lu seulement les messages reçus (pas envoyés par l'utilisateur)
      const [affectedRows] = await Message.update(
        { is_read: true },
        {
          where: {
            message_id: { [Op.in]: idsArray },
            sender_id: { [Op.ne]: userId }, // Exclure les messages envoyés par l'utilisateur
            is_read: false // Seulement les non lus
          }
        }
      );

      return affectedRows;

    } catch (error) {
      console.error('❌ Erreur markAsRead:', error);
      throw error;
    }
  },

  /**
   * Compter les messages non lus pour un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} conversationId - ID conversation spécifique (optionnel)
   * @returns {number} Nombre de messages non lus
   */
  async getUnreadCount(userId, conversationId = null) {
    try {
      if (!userId) {
        throw new Error('L\'ID utilisateur est requis');
      }

      const whereClause = {
        sender_id: { [Op.ne]: userId }, // Messages reçus (pas envoyés)
        is_read: false
      };

      // Filtrer par conversation si spécifiée
      if (conversationId) {
        whereClause.conversation_id = conversationId;
      } else {
        // Sinon, inclure seulement les conversations où l'utilisateur participe
        const userConversations = await Conversation.findAll({
          where: {
            [Op.or]: [
              { user1_id: userId },
              { user2_id: userId }
            ]
          },
          attributes: ['conversation_id']
        });

        const conversationIds = userConversations.map(conv => conv.conversation_id);
        whereClause.conversation_id = { [Op.in]: conversationIds };
      }

      const unreadCount = await Message.count({
        where: whereClause
      });

      return unreadCount;

    } catch (error) {
      console.error('❌ Erreur getUnreadCount:', error);
      throw error;
    }
  },

  /**
   * Méthode helper pour récupérer un message avec les infos expéditeur
   * @param {number} messageId - ID du message
   * @returns {Object} Message avec expéditeur
   */
  async getMessageWithSender(messageId) {
    try {
      const message = await Message.findOne({
        where: { message_id: messageId },
        include: [
          {
            association: 'sender',
            attributes: { exclude: ['password'] }
          }
        ]
      });

      if (!message) {
        throw new Error('Message non trouvé');
      }

      // Mapping cohérent
      return {
        id: message.message_id,
        conversationId: message.conversation_id,
        content: message.content,
        sentAt: message.sent_at,
        isRead: message.is_read,
        sender: {
          id: message.sender.user_id,
          firstName: message.sender.first_name,
          lastName: message.sender.last_name,
          username: message.sender.username,
          profilePicture: message.sender.profile_picture
        }
      };

    } catch (error) {
      console.error('❌ Erreur getMessageWithSender:', error);
      throw error;
    }
  }
};