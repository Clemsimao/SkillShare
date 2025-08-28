// Hook pour la gestion du profil utilisateur (distinct de l'authentification)

import { useState, useCallback, useEffect } from "react";
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  deleteAccount,
} from "../services/user";
import { useAuth } from "./use-auth";
import { useApi } from "./use-api";
import type { 
  User, 
  UpdateUserData,
  ApiStatusType 
} from "../types/api";

interface UseProfileReturn {
  // État du profil
  profile: User | null;
  isOwnProfile: boolean;
  status: ApiStatusType;
  error: string | null;
  isLoading: boolean;

  // Actions de profil
  loadProfile: (userId: number) => Promise<boolean>;
  updateCurrentProfile: (userData: UpdateUserData) => Promise<boolean>;
  uploadAvatar: (image: File) => Promise<string | null>;
  removeAccount: () => Promise<boolean>;

  // Helpers
  isProfileComplete: () => boolean;
  getMissingFields: () => string[];
  reset: () => void;
}

/**
 * Hook de gestion du profil utilisateur
 * Distinct de useAuth - se concentre sur la gestion des données de profil
 */
export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<User | null>(null);
  const { user } = useAuth();

  // Hooks API
  const loadProfileApi = useApi(getUserProfile);
  const updateProfileApi = useApi(updateProfile);
  const uploadAvatarApi = useApi(uploadProfilePicture);
  const deleteAccountApi = useApi(deleteAccount);

  // Vérifier si c'est le profil de l'utilisateur connecté
  const isOwnProfile = profile?.id === user?.id;

  // État global
  const isLoading = [
    loadProfileApi.isLoading,
    updateProfileApi.isLoading,
    uploadAvatarApi.isLoading,
    deleteAccountApi.isLoading,
  ].some(Boolean);

  const error = loadProfileApi.error || 
                updateProfileApi.error || 
                uploadAvatarApi.error || 
                deleteAccountApi.error;

  const status: ApiStatusType = isLoading ? "loading" : 
                               error ? "error" : 
                               profile ? "success" : "idle";

  /**
   * CHARGER UN PROFIL UTILISATEUR
   */
  const loadProfile = useCallback(async (userId: number): Promise<boolean> => {
    const result = await loadProfileApi.execute(userId);
    if (result) {
      setProfile(result.user);
      return true;
    }
    return false;
  }, [loadProfileApi]);

  /**
   * METTRE À JOUR LE PROFIL COURANT
   * Ne fonctionne que si c'est le profil de l'utilisateur connecté
   */
  const updateCurrentProfile = useCallback(async (
    userData: UpdateUserData
  ): Promise<boolean> => {
    if (!isOwnProfile) {
      console.warn("Tentative de modification d'un profil non autorisé");
      return false;
    }

    const result = await updateProfileApi.execute(userData);
    if (result) {
      setProfile(result.user);
      return true;
    }
    return false;
  }, [updateProfileApi, isOwnProfile]);

  /**
   * UPLOAD D'AVATAR
   */
  const uploadAvatar = useCallback(async (image: File): Promise<string | null> => {
    if (!isOwnProfile) {
      console.warn("Tentative d'upload d'avatar non autorisé");
      return null;
    }

    const result = await uploadAvatarApi.execute(image);
    if (result) {
      // Mettre à jour l'URL de l'avatar dans le profil local
      setProfile(prev => 
        prev ? { ...prev, profilePicture: result.url } : prev
      );
      return result.url;
    }
    return null;
  }, [uploadAvatarApi, isOwnProfile]);

  /**
   * SUPPRESSION DE COMPTE
   */
  const removeAccount = useCallback(async (): Promise<boolean> => {
    if (!isOwnProfile) {
      console.warn("Tentative de suppression de compte non autorisé");
      return false;
    }

    const result = await deleteAccountApi.execute();
    if (result) {
      setProfile(null);
      return true;
    }
    return false;
  }, [deleteAccountApi, isOwnProfile]);

  /**
   * HELPER - Vérifier si le profil est complet
   */
  const isProfileComplete = useCallback((): boolean => {
    if (!profile) return false;
    
    const requiredFields = ['firstName', 'lastName', 'username', 'birthdate'];
    return requiredFields.every(field => {
      const value = profile[field as keyof User];
      return value && value.toString().trim().length > 0;
    });
  }, [profile]);

  /**
   * HELPER - Obtenir la liste des champs manquants
   */
  const getMissingFields = useCallback((): string[] => {
    if (!profile) return [];

    const fields = [
      { key: 'firstName', label: 'Prénom' },
      { key: 'lastName', label: 'Nom' },
      { key: 'username', label: 'Nom d\'utilisateur' },
      { key: 'birthdate', label: 'Date de naissance' },
      { key: 'content', label: 'Description' },
    ];

    return fields
      .filter(field => {
        const value = profile[field.key as keyof User];
        return !value || value.toString().trim().length === 0;
      })
      .map(field => field.label);
  }, [profile]);

  /**
   * RESET - Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setProfile(null);
    loadProfileApi.reset();
    updateProfileApi.reset();
    uploadAvatarApi.reset();
    deleteAccountApi.reset();
  }, [loadProfileApi, updateProfileApi, uploadAvatarApi, deleteAccountApi]);

  return {
    profile,
    isOwnProfile,
    status,
    error,
    isLoading,
    loadProfile,
    updateCurrentProfile,
    uploadAvatar,
    removeAccount,
    isProfileComplete,
    getMissingFields,
    reset,
  };
};

/**
 * Hook spécialisé pour le profil de l'utilisateur connecté
 */
export const useCurrentUserProfile = () => {
  const { user } = useAuth();
  const profileHook = useProfile();

  // Chargement automatique du profil de l'utilisateur connecté
  useEffect(() => {
    if (user?.id) {
      profileHook.loadProfile(user.id);
    } else {
      profileHook.reset();
    }
  }, [user?.id]);

  return {
    ...profileHook,
    isLoaded: profileHook.profile !== null,
  };
};

/**
 * Hook pour la validation et édition de profil
 */
export const useProfileEditor = () => {
  const [formData, setFormData] = useState<UpdateUserData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const updateField = useCallback((field: keyof UpdateUserData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      setHasChanges(true);
      return updated;
    });

    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: removed, ...rest } = prev;
        return rest;
      });
    }
  }, [validationErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: Record<string, string> = {};

    // Validation des champs
    if (formData.firstName && formData.firstName.trim().length < 2) {
      errors.firstName = "Le prénom doit contenir au moins 2 caractères";
    }
    
    if (formData.lastName && formData.lastName.trim().length < 2) {
      errors.lastName = "Le nom doit contenir au moins 2 caractères";
    }

    if (formData.content && formData.content.length > 500) {
      errors.content = "La description ne peut pas dépasser 500 caractères";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const resetForm = useCallback((initialData?: UpdateUserData) => {
    setFormData(initialData || {});
    setHasChanges(false);
    setValidationErrors({});
  }, []);

  return {
    formData,
    hasChanges,
    validationErrors,
    updateField,
    validateForm,
    resetForm,
    isValid: Object.keys(validationErrors).length === 0,
  };
};