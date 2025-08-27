// hooks/use-auth.ts
// Hook React pour l'authentification avec état global

import { useState, useEffect, useCallback } from "react";
import {
  login as loginService,
  register as registerService,
  logout as logoutService,
  getProfile,
  isAuthenticated,
  getCurrentUser,
  forceLogout,
} from "../services/auth";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  ApiStatusType,
} from "../types/api";

interface UseAuthReturn {
  // État d'authentification
  isLoggedIn: boolean;
  user: User | null;
  status: ApiStatusType;
  error: string | null;

  // Actions d'authentification
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
}

/**
 * Hook d'authentification centralisé
 * Gère l'état de connexion, les données utilisateur et les actions d'auth
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<ApiStatusType>("idle");
  const [error, setError] = useState<string | null>(null);

  // État de connexion basé sur la présence d'un utilisateur
  const isLoggedIn = user !== null;

  /**
   * INITIALISATION - Vérifier l'état de connexion au chargement
   */
  useEffect(() => {
    const initializeAuth = async () => {
      if (!isAuthenticated()) {
        setStatus("idle");
        return;
      }

      try {
        setStatus("loading");
        const response = await getProfile();
        setUser(response.user);
        setStatus("success");
      } catch (error) {
        console.error("Erreur initialisation auth:", error);
        forceLogout();
        setUser(null);
        setStatus("idle");
      }
    };

    initializeAuth();
  }, []);

  /**
   * CONNEXION - Authentifier un utilisateur
   */
  const login = useCallback(
    async (credentials: LoginRequest): Promise<boolean> => {
      try {
        setStatus("loading");
        setError(null);

        const response = await loginService(credentials);
        setUser(response.user);
        setStatus("success");

        return true;
      } catch (error: unknown) {
        setStatus("error");
        const errorMessage =
          error instanceof Error ? error.message : "Erreur de connexion";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  /**
   * INSCRIPTION - Créer un nouveau compte
   */
  const register = useCallback(
    async (userData: RegisterRequest): Promise<boolean> => {
      try {
        setStatus("loading");
        setError(null);

        const response = await registerService(userData);
        setUser(response.user);
        setStatus("success");

        return true;
      } catch (error: unknown) {
        setStatus("error");
        const errorMessage =
          error instanceof Error ? error.message : "Erreur d'inscription";
        setError(errorMessage);
        return false;
      }
    },
    []
  );

  /**
   * DÉCONNEXION - Terminer la session
   */
  const logout = useCallback(async (): Promise<void> => {
    try {
      await logoutService();
    } catch (error) {
      // Continue même si l'API échoue
      console.error("Erreur déconnexion API:", error);
    } finally {
      setUser(null);
      setStatus("idle");
      setError(null);
    }
  }, []);

  /**
   * RAFRAÎCHISSEMENT PROFIL - Recharger les données utilisateur
   */
  const refreshProfile = useCallback(async (): Promise<void> => {
    if (!isAuthenticated()) return;

    try {
      setStatus("loading");
      const response = await getProfile();
      setUser(response.user);
      setStatus("success");
    } catch (error: unknown) {
      setStatus("error");
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur de chargement du profil";
      setError(errorMessage);

      // Force logout sur toute erreur de récupération de profil
      forceLogout();
      setUser(null);
      setStatus("idle");
    }
  }, []);

  /**
   * EFFACER ERREUR - Nettoyer les messages d'erreur
   */
  const clearError = useCallback(() => {
    setError(null);
    if (status === "error") {
      setStatus("idle");
    }
  }, [status]);

  return {
    isLoggedIn,
    user,
    status,
    error,
    login,
    register,
    logout,
    refreshProfile,
    clearError,
  };
};
