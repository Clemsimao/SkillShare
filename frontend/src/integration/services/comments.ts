// services/comments.ts
// Services de gestion des commentaires sur les tutoriels

import { api } from "../lib/http-client";
import { ENDPOINTS, buildUrl } from "../lib/config";
import type {
  Comment,
  CommentsResponse,
  CreateCommentRequest,
  UpdateCommentRequest,
  ApiResponse,
} from "../types/api";

/**
 * ================================
 * COMMENT SERVICES
 * ================================
 * Gestion complète des commentaires :
 * - Consultation des commentaires d'un tutoriel
 * - Création de nouveaux commentaires
 * - Modification de ses propres commentaires
 * - Suppression de ses propres commentaires
 */

/**
 * LISTE COMMENTAIRES - Récupérer tous les commentaires d'un tutoriel
 * @param tutorialId - ID du tutoriel
 * @returns Liste des commentaires avec détails des auteurs
 */
export const getCommentsByTutorial = async (
  tutorialId: number
): Promise<{
  success: boolean;
  message: string;
  comments: Comment[];
  count: number;
}> => {
  return api.get<{
    success: boolean;
    message: string;
    comments: Comment[];
    count: number;
  }>(buildUrl.commentsByTutorial(tutorialId));
};

/**
 * CRÉATION COMMENTAIRE - Ajouter un commentaire à un tutoriel
 * @param commentData - Données du commentaire (tutorial_id, content)
 * @returns Commentaire créé avec confirmation
 */
export const createComment = async (
  commentData: CreateCommentRequest
): Promise<{ success: boolean; message: string; comment: Comment }> => {
  return api.post<{ success: boolean; message: string; comment: Comment }>(
    ENDPOINTS.COMMENTS.CREATE,
    commentData
  );
};

/**
 * MODIFICATION COMMENTAIRE - Mettre à jour le contenu d'un commentaire
 * @param commentId - ID du commentaire à modifier
 * @param commentData - Nouveau contenu du commentaire
 * @returns Commentaire mis à jour
 */
export const updateComment = async (
  commentId: number,
  commentData: UpdateCommentRequest
): Promise<{ success: boolean; message: string; comment: Comment }> => {
  return api.put<{ success: boolean; message: string; comment: Comment }>(
    buildUrl.updateComment(commentId),
    commentData
  );
};

/**
 * SUPPRESSION COMMENTAIRE - Supprimer définitivement un commentaire
 * @param commentId - ID du commentaire à supprimer
 * @returns Confirmation de suppression
 */
export const deleteComment = async (
  commentId: number
): Promise<{ success: boolean; message: string }> => {
  return api.delete<{ success: boolean; message: string }>(
    buildUrl.deleteComment(commentId)
  );
};

/**
 * ================================
 * HELPERS ET UTILITAIRES
 * ================================
 */

/**
 * VALIDATION - Vérifier si un utilisateur peut modifier un commentaire
 * @param comment - Commentaire à vérifier
 * @param currentUserId - ID de l'utilisateur connecté
 * @returns true si l'utilisateur peut modifier, false sinon
 */
export const canEditComment = (
  comment: Comment,
  currentUserId: number
): boolean => {
  return comment.author.user_id === currentUserId;
};

/**
 * HELPER - Formater une date de commentaire pour affichage
 * @param createdAt - Date de création ISO
 * @returns Date formatée pour l'affichage
 */
export const formatCommentDate = (createdAt: string): string => {
  const date = new Date(createdAt);
  const now = new Date();
  const diffInHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60)
  );

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );
    return diffInMinutes < 1 ? "À l'instant" : `Il y a ${diffInMinutes} min`;
  }

  if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`;
  }

  if (diffInHours < 168) {
    // 7 jours
    const diffInDays = Math.floor(diffInHours / 24);
    return `Il y a ${diffInDays} jour${diffInDays > 1 ? "s" : ""}`;
  }

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
};

/**
 * HELPER - Créer les données pour un nouveau commentaire
 * @param tutorialId - ID du tutoriel à commenter
 * @param content - Contenu du commentaire
 * @returns Données formatées pour la création
 */
export const createCommentData = (
  tutorialId: number,
  content: string
): CreateCommentRequest => ({
  tutorial_id: tutorialId,
  content: content.trim(),
});

/**
 * HELPER - Valider le contenu d'un commentaire
 * @param content - Contenu à valider
 * @returns true si valide, false sinon
 */
export const validateCommentContent = (content: string): boolean => {
  const trimmedContent = content.trim();
  return trimmedContent.length >= 3 && trimmedContent.length <= 500;
};
