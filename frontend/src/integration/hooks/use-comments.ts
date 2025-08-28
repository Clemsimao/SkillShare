// Hook pour la gestion des commentaires sur les tutoriels

import { useState, useCallback, useEffect } from "react";
import {
  getCommentsByTutorial,
  createComment,
  updateComment,
  deleteComment,
  canEditComment,
  validateCommentContent,
} from "../services/comments";
import { useAuth } from "./use-auth";
import { useApi } from "./use-api";
import type { 
  Comment, 
  CreateCommentRequest, 
  UpdateCommentRequest,
  ApiStatusType 
} from "../types/api";

interface UseCommentsReturn {
  // État des commentaires
  comments: Comment[];
  commentsCount: number;
  status: ApiStatusType;
  error: string | null;
  isLoading: boolean;

  // Actions CRUD
  loadComments: (tutorialId: number) => Promise<boolean>;
  addComment: (tutorialId: number, content: string) => Promise<Comment | null>;
  editComment: (commentId: number, content: string) => Promise<Comment | null>;
  removeComment: (commentId: number) => Promise<boolean>;

  // Helpers de validation et permissions
  canUserEditComment: (comment: Comment) => boolean;
  isValidContent: (content: string) => boolean;
  reset: () => void;
}

/**
 * Hook de gestion des commentaires
 * Gère les opérations CRUD et les permissions utilisateur
 */
export const useComments = (): UseCommentsReturn => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const { user } = useAuth();

  // Hooks API pour chaque opération
  const loadCommentsApi = useApi(getCommentsByTutorial);
  const createCommentApi = useApi(createComment);
  const updateCommentApi = useApi(updateComment);
  const deleteCommentApi = useApi(deleteComment);

  // État global
  const isLoading = [
    loadCommentsApi.isLoading,
    createCommentApi.isLoading,
    updateCommentApi.isLoading,
    deleteCommentApi.isLoading,
  ].some(Boolean);

  const error = loadCommentsApi.error || 
                createCommentApi.error || 
                updateCommentApi.error || 
                deleteCommentApi.error;

  const status: ApiStatusType = isLoading ? "loading" : 
                               error ? "error" : "success";

  /**
   * CHARGER LES COMMENTAIRES D'UN TUTORIEL
   */
  const loadComments = useCallback(async (tutorialId: number): Promise<boolean> => {
    const result = await loadCommentsApi.execute(tutorialId);
    if (result) {
      setComments(result.comments);
      setCommentsCount(result.count);
      return true;
    }
    return false;
  }, [loadCommentsApi]);

  /**
   * AJOUTER UN COMMENTAIRE
   */
  const addComment = useCallback(async (
    tutorialId: number,
    content: string
  ): Promise<Comment | null> => {
    // Validation du contenu
    if (!isValidContent(content)) {
      return null;
    }

    const commentData: CreateCommentRequest = {
      tutorial_id: tutorialId,
      content: content.trim(),
    };

    const result = await createCommentApi.execute(commentData);
    if (result) {
      // Ajouter le nouveau commentaire en haut de la liste
      setComments(prev => [result.comment, ...prev]);
      setCommentsCount(prev => prev + 1);
      return result.comment;
    }
    return null;
  }, [createCommentApi]);

  /**
   * MODIFIER UN COMMENTAIRE
   */
  const editComment = useCallback(async (
    commentId: number,
    content: string
  ): Promise<Comment | null> => {
    // Validation du contenu
    if (!isValidContent(content)) {
      return null;
    }

    const commentData: UpdateCommentRequest = {
      content: content.trim(),
    };

    const result = await updateCommentApi.execute(commentId, commentData);
    if (result) {
      // Mettre à jour le commentaire dans la liste locale
      setComments(prev =>
        prev.map(comment =>
          comment.comment_id === commentId ? result.comment : comment
        )
      );
      return result.comment;
    }
    return null;
  }, [updateCommentApi]);

  /**
   * SUPPRIMER UN COMMENTAIRE
   */
  const removeComment = useCallback(async (commentId: number): Promise<boolean> => {
    const result = await deleteCommentApi.execute(commentId);
    if (result) {
      // Supprimer de la liste locale
      setComments(prev => prev.filter(comment => comment.comment_id !== commentId));
      setCommentsCount(prev => prev - 1);
      return true;
    }
    return false;
  }, [deleteCommentApi]);

  /**
   * HELPER - Vérifier si l'utilisateur peut modifier un commentaire
   */
  const canUserEditComment = useCallback((comment: Comment): boolean => {
    if (!user) return false;
    return canEditComment(comment, user.id);
  }, [user]);

  /**
   * HELPER - Valider le contenu d'un commentaire
   */
  const isValidContent = useCallback((content: string): boolean => {
    return validateCommentContent(content);
  }, []);

  /**
   * RESET - Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setComments([]);
    setCommentsCount(0);
    loadCommentsApi.reset();
    createCommentApi.reset();
    updateCommentApi.reset();
    deleteCommentApi.reset();
  }, [loadCommentsApi, createCommentApi, updateCommentApi, deleteCommentApi]);

  return {
    comments,
    commentsCount,
    status,
    error,
    isLoading,
    loadComments,
    addComment,
    editComment,
    removeComment,
    canUserEditComment,
    isValidContent,
    reset,
  };
};

/**
 * Hook spécialisé pour un tutoriel spécifique
 * Charge automatiquement les commentaires au montage
 */
export const useTutorialComments = (tutorialId: number | null) => {
  const commentsHook = useComments();

  // Chargement automatique des commentaires
  useEffect(() => {
    if (tutorialId) {
      commentsHook.loadComments(tutorialId);
    } else {
      commentsHook.reset();
    }
  }, [tutorialId]);

  // Fonction d'ajout simplifiée pour ce tutoriel
  const addCommentToTutorial = useCallback(async (content: string) => {
    if (!tutorialId) return null;
    return await commentsHook.addComment(tutorialId, content);
  }, [tutorialId, commentsHook.addComment]);

  return {
    ...commentsHook,
    addCommentToTutorial,
    isEmpty: commentsHook.comments.length === 0 && !commentsHook.isLoading,
  };
};

/**
 * Hook pour la création/édition de commentaire avec état local
 */
export const useCommentForm = (initialContent = "") => {
  const [content, setContent] = useState(initialContent);
  const [isValid, setIsValid] = useState(false);

  // Validation en temps réel
  useEffect(() => {
    setIsValid(validateCommentContent(content));
  }, [content]);

  const updateContent = useCallback((newContent: string) => {
    setContent(newContent);
  }, []);

  const resetForm = useCallback(() => {
    setContent("");
    setIsValid(false);
  }, []);

  return {
    content,
    isValid,
    updateContent,
    resetForm,
    characterCount: content.trim().length,
    remainingCharacters: 500 - content.trim().length,
  };
};