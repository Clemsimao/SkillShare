// services/auth.ts
// Service d'authentification complet basé sur l'analyse du backend

import { api } from "../lib/http-client";
import { ENDPOINTS } from "../lib/config";
import { storeToken, removeToken, getUserFromToken } from "../lib/token";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ApiResponse,
} from "../types/api";

/**
 * INSCRIPTION - Créer un nouveau compte utilisateur
 */
export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
  storeToken(response.token);
  return response;
};

/**
 * CONNEXION - Authentifier un utilisateur existant
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, data);
  storeToken(response.token);
  return response;
};

/**
 * DÉCONNEXION - Terminer la session utilisateur
 */
export const logout = async (): Promise<ApiResponse> => {
  try {
    const response = await api.post<ApiResponse>(ENDPOINTS.AUTH.LOGOUT);
    removeToken();
    return response;
  } catch (error) {
    removeToken();
    throw error;
  }
};

/**
 * RÉCUPÉRATION DU PROFIL - Obtenir les données de l'utilisateur connecté
 */
export const getProfile = async (): Promise<{
  success: boolean;
  user: User;
}> => {
  return api.get<{ success: boolean; user: User }>(ENDPOINTS.AUTH.PROFILE);
};

/**
 * VÉRIFICATION DE L'ÉTAT DE CONNEXION
 */
export const isAuthenticated = (): boolean => {
  const userInfo = getUserFromToken();
  return userInfo !== null;
};

/**
 * RÉCUPÉRATION DES INFOS UTILISATEUR DEPUIS LE TOKEN
 */
export const getCurrentUser = (): { id: number; email: string } | null => {
  return getUserFromToken();
};

/**
 * FORCER LA DÉCONNEXION LOCALE
 */
export const forceLogout = (): void => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};
