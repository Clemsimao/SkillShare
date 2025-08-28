// services/tutorials.ts
// Services de gestion des tutoriels CRUD

import { api, uploadFile } from "../lib/http-client";
import { ENDPOINTS, buildUrl } from "../lib/config";
import type {
  Tutorial,
  TutorialsResponse,
  TutorialResponse,
  CreateTutorialRequest,
  UpdateTutorialRequest,
  ApiResponse,
} from "../types/api";

/**
 * LISTE COMPLÈTE - Récupérer tous les tutoriels publiés
 */
export const getAllTutorials = async (): Promise<TutorialsResponse> => {
  const { data } = await api.get<TutorialsResponse>(ENDPOINTS.TUTORIALS.LIST);
    return data;
};

/**
 * DÉTAIL TUTORIEL - Récupérer un tutoriel spécifique par son ID
 */
export const getTutorial = async (
  tutorialId: number
): Promise<TutorialResponse> => {
  const { data } = await api.get<TutorialResponse>(buildUrl.tutorialDetail(tutorialId));
    return data;
};

/**
 * CRÉATION TUTORIEL - Créer un nouveau tutoriel
 */
export const createTutorial = async (
  tutorialData: CreateTutorialRequest
): Promise<{ success: boolean; message: string; tutorial: Tutorial }> => {
  const { data } = await api.post<{ success: boolean; message: string; tutorial: Tutorial }>(
    ENDPOINTS.TUTORIALS.CREATE,
    tutorialData
  );
    return data;
};

/**
 * MODIFICATION TUTORIEL - Mettre à jour un tutoriel existant
 */
export const updateTutorial = async (
  tutorialId: number,
  tutorialData: UpdateTutorialRequest
): Promise<{ success: boolean; message: string; tutorial: Tutorial }> => {
  const { data } = await api.put<{ success: boolean; message: string; tutorial: Tutorial }>(
    buildUrl.tutorialUpdate(tutorialId),
    tutorialData
  );
    return data;
};

/**
 * SUPPRESSION TUTORIEL - Supprimer définitivement un tutoriel
 */
export const deleteTutorial = async (
  tutorialId: number
): Promise<ApiResponse> => {
  const { data } = await api.delete<ApiResponse>(buildUrl.tutorialDelete(tutorialId));
    return data;
};

/**
 * UPLOAD IMAGE - Ajouter/modifier l'image d'un tutoriel
 */
export const uploadTutorialImage = async (
  tutorialId: number,
  imageFile: File
): Promise<{ success: boolean; imageUrl: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  return uploadFile<{ success: boolean; imageUrl: string }>(
    buildUrl.tutorialUploadImage(tutorialId),
    formData
  );
};

/**
 * VALIDATION - Vérifier si un utilisateur peut modifier un tutoriel
 */
export const canEditTutorial = (
  tutorial: Tutorial,
  currentUserId: number
): boolean => {
  return tutorial.author.id === currentUserId;
};

/**
 * HELPER - Formater une date de publication pour affichage
 */
export const formatPublishedDate = (publishedAt: string): string => {
  const date = new Date(publishedAt);
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * HELPER - Extraire un aperçu du contenu d'un tutoriel
 */
export const getContentPreview = (content: string, maxLength = 150): string => {
  if (content.length <= maxLength) return content;

  return `${content.substring(0, maxLength).trim()}...`;
};
