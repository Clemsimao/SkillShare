import { commentService } from '../services/commentService.js';

export const createComment = async (req, res) => {
  try {
    // Récupère l'identité de l'utilisateur connecté (via JWT) et les données envoyées par le client
    const userId = req.user?.id;               
    const { tutorial_id, content } = req.body; 

    // Vérifie que l'utilisateur est authentifié et que les champs requis sont présents
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!tutorial_id || !content) {
      return res.status(400).json({ success: false, message: 'tutorial_id and content are required' });
    }

    // Appelle le service métier pour créer le commentaire (gère aussi le flag is_author)
    const created = await commentService.create({
      userId,
      tutorialId: Number(tutorial_id),
      content
    });

    // Retourne une réponse avec le commentaire créé
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    console.error('❌ Error createComment:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error creating comment' });
  }
};

export const listCommentsByTutorial = async (req, res) => {
  try {
    // Récupère l'identifiant du tutoriel depuis les paramètres de l'URL
    const tutorialId = Number(req.params.tutorialId);
    if (!tutorialId) {
      return res.status(400).json({ success: false, message: 'Invalid tutorialId' });
    }

    // Appelle le service pour récupérer tous les commentaires liés à ce tutoriel
    const comments = await commentService.listByTutorial(tutorialId);

    // Retourne la liste des commentaires trouvés
    return res.status(200).json({ success: true, data: comments });
  } catch (error) {
    console.error('❌ Error listCommentsByTutorial:', error);
    return res.status(500).json({ success: false, message: error.message || 'Error fetching comments' });
  }
};

export const updateComment = async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté et l'id du commentaire à modifier
    const userId = req.user?.id;
    const commentId = Number(req.params.id);
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Appelle le service qui met à jour le commentaire si l'utilisateur en est bien l'auteur
    const updated = await commentService.update({ commentId, userId, content });

    // Retourne le commentaire mis à jour
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error('❌ Error updateComment:', error);
    if (error.message === 'Comment not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Forbidden') {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }
    return res.status(500).json({ success: false, message: error.message || 'Error updating comment' });
  }
};

export const deleteComment = async (req, res) => {
  try {
    // Récupère l'identifiant de l'utilisateur connecté et l'id du commentaire à supprimer
    const userId = req.user?.id;
    const commentId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Appelle le service qui supprime le commentaire si l'utilisateur en est bien l'auteur
    await commentService.remove({ commentId, userId });

    // Retourne un statut 204 (No Content) si la suppression a réussi
    return res.status(204).send(); 
  } catch (error) {
    console.error('❌ Error deleteComment:', error);
    if (error.message === 'Comment not found') {
      return res.status(404).json({ success: false, message: error.message });
    }
    if (error.message === 'Forbidden') {
      return res.status(403).json({ success: false, message: 'Not allowed' });
    }
    return res.status(500).json({ success: false, message: error.message || 'Error deleting comment' });
  }
};