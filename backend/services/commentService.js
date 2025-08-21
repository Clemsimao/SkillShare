import { Comment, User, Tutorial } from '../models/index.js';

export const commentService = {
  /**
   * Créer un commentaire
   * @param {number} userId - auteur
   * @param {number} tutorialId - tutoriel ciblé
   * @param {string} content - texte du commentaire
   */
  async create({ userId, tutorialId, content }) {
    try {
      // Vérifie si l'utilisateur qui commente est aussi l'auteur du tutoriel (permet de flag son commentaire comme "is_author")
      // Vérifie si le commentateur est l'auteur du tutoriel pour définir is_author
      const ownsTutorial = await Tutorial.findOne({
        where: { tutorial_id: tutorialId, user_id: userId },
        attributes: ['tutorial_id']
      });

      // Création du commentaire avec l'indication is_author selon le résultat précédent
      const comment = await Comment.create({
        user_id: userId,
        tutorial_id: tutorialId,
        content,
        is_author: !!ownsTutorial
      });
      return comment;
    } catch (error) {
      console.error('❌ Error commentService.create:', error);
      throw new Error('Erreur lors de la création du commentaire');
    }
  },

   /**
   * Lister les commentaires d’un tutoriel (avec l’auteur)
   * @param {number} tutorialId
   */
  async listByTutorial(tutorialId) {
    try {
        // Récupère tous les commentaires liés à un tutoriel, triés du plus récent au plus ancien
        const comments = await Comment.findAll({
            where: { tutorial_id: tutorialId },
            order: [['created_at', 'DESC']],
            // Inclut également les informations de l'auteur du commentaire (id, username, avatar)
            include: [
                { model: User, as: 'author', attributes: ['user_id', 'username', 'profile_picture'] }
            ]
        });
        return comments;
    } catch (error) {
        console.error('❌ Error commentService.listByTutorial:', error);
        throw new Error('Erreur lors de la récupération des commentaires')
    }
  },


  /**
   * Mettre à jour un commentaire (seulement par son auteur)
   * @param {number} commentId
   * @param {number} userId - auteur attendu
   * @param {string} content - nouveau contenu
   */
  async update({ commentId, userId, content }) {
    try {
        // Recherche le commentaire par sa clé primaire (id)
        const comment = await Comment.findByPk(commentId);
        if (!comment) throw new Error('Comment not found');
        // Vérifie que l'utilisateur connecté est bien l'auteur du commentaire
        if (comment.user_id !== userId) throw new Error('Forbidden');

        // Met à jour le contenu (si fourni) et la date de modification
        comment.content = content ?? comment.content;
        comment.updated_at = new Date();
        await comment.save();
        
        return comment; 
    } catch (error) {
        console.error('❌ Error commentService.update:', error);
        if (['Comment not found', 'Forbidden'].includes(error.message)) throw error;
        throw new Error('Erreur lors de la mise à jour du commentaire');
    }
  },
/**
   * Supprimer un commentaire (seulement par son auteur)
   * @param {number} commentId
   * @param {number} userId - auteur attendu
   */
  async remove({ commentId, userId }) {
    try {
        // Recherche le commentaire à supprimer
        const comment = await Comment.findByPk(commentId);
        if (!comment) throw new Error('Comment not found');
        // Vérifie que seul l'auteur du commentaire peut le supprimer
        if (comment.user_id !== userId) throw new Error('Forbidden');

        await comment.destroy();
        return true;
    } catch (error) {
        console.error('❌ Error commentService.remove:', error);
        if (['Comment not found', 'Forbidden'].includes(error.message)) throw error;
        throw new Error('Erreur lors de la suppression du commentaire');
    }
  }
};
