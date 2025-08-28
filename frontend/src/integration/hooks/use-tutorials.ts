// Hook pour la gestion complète des tutoriels

import { useState, useCallback } from "react";
import {
  getAllTutorials,
  getTutorial,
  createTutorial,
  updateTutorial,
  deleteTutorial,
  uploadTutorialImage,
  canEditTutorial,
} from "../services/tutorials";
import { useApi } from "./use-api";
import type { 
  Tutorial, 
  CreateTutorialRequest, 
  UpdateTutorialRequest,
  ApiStatusType 
} from "../types/api";

interface UseTutorialsReturn {
  // État des tutoriels
  tutorials: Tutorial[];
  currentTutorial: Tutorial | null;
  status: ApiStatusType;
  error: string | null;
  isLoading: boolean;

  // Actions CRUD
  loadTutorials: () => Promise<boolean>;
  loadTutorialById: (id: number) => Promise<boolean>;
  createNewTutorial: (data: CreateTutorialRequest) => Promise<Tutorial | null>;
  updateExistingTutorial: (id: number, data: UpdateTutorialRequest) => Promise<Tutorial | null>;
  deleteTutorialById: (id: number) => Promise<boolean>;
  uploadImage: (tutorialId: number, image: File) => Promise<string | null>;

  // Helpers
  findTutorialById: (id: number) => Tutorial | undefined;
  getTutorialsByAuthor: (authorId: number) => Tutorial[];
  clearCurrentTutorial: () => void;
  reset: () => void;
}

/**
 * Hook de gestion des tutoriels
 * Gère les opérations CRUD et l'état local des tutoriels
 */
export const useTutorials = (): UseTutorialsReturn => {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [currentTutorial, setCurrentTutorial] = useState<Tutorial | null>(null);

  // Hooks API pour chaque opération
  const loadTutorialsApi = useApi(getAllTutorials);
  const loadTutorialApi = useApi(getTutorial);
  const createTutorialApi = useApi(createTutorial);
  const updateTutorialApi = useApi(updateTutorial);
  const deleteTutorialApi = useApi(deleteTutorial);
  const uploadImageApi = useApi(uploadTutorialImage);

  // État global basé sur les opérations en cours
  const isLoading = [
    loadTutorialsApi.isLoading,
    loadTutorialApi.isLoading,
    createTutorialApi.isLoading,
    updateTutorialApi.isLoading,
    deleteTutorialApi.isLoading,
    uploadImageApi.isLoading,
  ].some(Boolean);

  const error = loadTutorialsApi.error || 
                loadTutorialApi.error || 
                createTutorialApi.error || 
                updateTutorialApi.error || 
                deleteTutorialApi.error || 
                uploadImageApi.error;

  const status: ApiStatusType = isLoading ? "loading" : 
                               error ? "error" : "success";

  /**
   * CHARGER TOUS LES TUTORIELS
   */
  const loadTutorials = useCallback(async (): Promise<boolean> => {
    const result = await loadTutorialsApi.execute();
    if (result) {
      setTutorials(result.tutorials);
      return true;
    }
    return false;
  }, [loadTutorialsApi]);

  /**
   * CHARGER UN TUTORIEL SPÉCIFIQUE
   */
  const loadTutorialById = useCallback(async (id: number): Promise<boolean> => {
    const result = await loadTutorialApi.execute(id);
    if (result) {
      setCurrentTutorial(result.tutorial);
      return true;
    }
    return false;
  }, [loadTutorialApi]);

  /**
   * CRÉER UN NOUVEAU TUTORIEL
   */
  const createNewTutorial = useCallback(async (
    data: CreateTutorialRequest
  ): Promise<Tutorial | null> => {
    const result = await createTutorialApi.execute(data);
    if (result) {
      // Ajouter le nouveau tutoriel à la liste locale
      setTutorials(prev => [result.tutorial, ...prev]);
      setCurrentTutorial(result.tutorial);
      return result.tutorial;
    }
    return null;
  }, [createTutorialApi]);

  /**
   * METTRE À JOUR UN TUTORIEL
   */
  const updateExistingTutorial = useCallback(async (
    id: number,
    data: UpdateTutorialRequest
  ): Promise<Tutorial | null> => {
    const result = await updateTutorialApi.execute(id, data);
    if (result) {
      // Mettre à jour dans la liste locale
      setTutorials(prev => 
        prev.map(tutorial => 
          tutorial.id === id ? result.tutorial : tutorial
        )
      );
      setCurrentTutorial(result.tutorial);
      return result.tutorial;
    }
    return null;
  }, [updateTutorialApi]);

  /**
   * SUPPRIMER UN TUTORIEL
   */
  const deleteTutorialById = useCallback(async (id: number): Promise<boolean> => {
    const result = await deleteTutorialApi.execute(id);
    if (result) {
      // Supprimer de la liste locale
      setTutorials(prev => prev.filter(tutorial => tutorial.id !== id));
      if (currentTutorial?.id === id) {
        setCurrentTutorial(null);
      }
      return true;
    }
    return false;
  }, [deleteTutorialApi, currentTutorial]);

  /**
   * UPLOAD D'IMAGE POUR UN TUTORIEL
   */
  const uploadImage = useCallback(async (
    tutorialId: number,
    image: File
  ): Promise<string | null> => {
    const result = await uploadImageApi.execute(tutorialId, image);
    if (result) {
      // Mettre à jour l'URL de l'image dans le tutoriel local
      setTutorials(prev =>
        prev.map(tutorial =>
          tutorial.id === tutorialId
            ? { ...tutorial, picture: result.imageUrl }
            : tutorial
        )
      );
      if (currentTutorial?.id === tutorialId) {
        setCurrentTutorial(prev => 
          prev ? { ...prev, picture: result.imageUrl } : prev
        );
      }
      return result.imageUrl;
    }
    return null;
  }, [uploadImageApi, currentTutorial]);

  /**
   * HELPER - Trouver un tutoriel par ID dans la liste locale
   */
  const findTutorialById = useCallback((id: number): Tutorial | undefined => {
    return tutorials.find(tutorial => tutorial.id === id);
  }, [tutorials]);

  /**
   * HELPER - Filtrer les tutoriels par auteur
   */
  const getTutorialsByAuthor = useCallback((authorId: number): Tutorial[] => {
    return tutorials.filter(tutorial => tutorial.author.id === authorId);
  }, [tutorials]);

  /**
   * EFFACER LE TUTORIEL COURANT
   */
  const clearCurrentTutorial = useCallback(() => {
    setCurrentTutorial(null);
  }, []);

  /**
   * RESET COMPLET
   */
  const reset = useCallback(() => {
    setTutorials([]);
    setCurrentTutorial(null);
    loadTutorialsApi.reset();
    loadTutorialApi.reset();
    createTutorialApi.reset();
    updateTutorialApi.reset();
    deleteTutorialApi.reset();
    uploadImageApi.reset();
  }, [
    loadTutorialsApi,
    loadTutorialApi,
    createTutorialApi,
    updateTutorialApi,
    deleteTutorialApi,
    uploadImageApi
  ]);

  return {
    tutorials,
    currentTutorial,
    status,
    error,
    isLoading,
    loadTutorials,
    loadTutorialById,
    createNewTutorial,
    updateExistingTutorial,
    deleteTutorialById,
    uploadImage,
    findTutorialById,
    getTutorialsByAuthor,
    clearCurrentTutorial,
    reset,
  };
};

/**
 * Hook simplifié pour un tutoriel spécifique
 */
export const useTutorial = (tutorialId: number | null) => {
  const { 
    currentTutorial, 
    loadTutorialById, 
    isLoading, 
    error 
  } = useTutorials();

  const loadTutorial = useCallback(async () => {
    if (tutorialId) {
      return await loadTutorialById(tutorialId);
    }
    return false;
  }, [tutorialId, loadTutorialById]);

  return {
    tutorial: currentTutorial,
    loadTutorial,
    isLoading,
    error,
    isEmpty: !currentTutorial && !isLoading,
  };
};