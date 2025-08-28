// Service d'authentification complet basé sur l'analyse du backend

import { api } from "../lib/http-client";
import { ENDPOINTS } from "../lib/config";
import { storeToken, removeToken, getUserFromToken } from "../lib/token";
import type {
  LoginRequest,
  RegisterRequest,
  User,
  ApiResponse,
} from "../types/api";

// Types spécifiques pour l'auth (sans hériter d'ApiResponse)
interface AuthResponse {
  readonly user: User;
  readonly token: string;
}

/**
 * INSCRIPTION - Créer un nouveau compte utilisateur
 * @param userData - Données d'inscription (email, password, firstName, lastName, username, birthdate)
 * @returns Promise avec token JWT et infos utilisateur
 */
export const register = async (
  userData: RegisterRequest
): Promise<AuthResponse> => {
  const {data} = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, userData);
  storeToken(data.token);
  return data;
};

/**
 * CONNEXION - Authentifier un utilisateur existant
 * @param authData - Email et mot de passe
 * @returns Promise avec token JWT et infos utilisateur
 */
export const login = async (authData: LoginRequest): Promise<AuthResponse> => {
  const {data} = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, authData);
  storeToken(data.token);
  return data;
};

/**
 * DÉCONNEXION - Terminer la session utilisateur
 * @returns Promise avec statut de déconnexion
 */
export const logout = async (): Promise<ApiResponse> => {
  try {
    const {data} = await api.post<ApiResponse>(ENDPOINTS.AUTH.LOGOUT);
    removeToken();
    return data;
  } catch (error) {
    removeToken();
    throw error;
  }
};

/**
 * RÉCUPÉRATION DU PROFIL - Obtenir les données de l'utilisateur connecté
 * @returns Promise avec les données complètes du profil utilisateur
 */
export const getProfile = async (): Promise<{
  success: boolean;
  user: User;
}> => {
  const {data} = await api.get<{ success: boolean; user: User }>(
    ENDPOINTS.AUTH.PROFILE
  );
  return data;
};

/**
 * VÉRIFICATION DE L'ÉTAT DE CONNEXION
 * @returns true si utilisateur connecté avec token valide, false sinon
 */
export const isAuthenticated = (): boolean => {
  const userInfo = getUserFromToken();
  return userInfo !== null;
};

/**
 * RÉCUPÉRATION DES INFOS UTILISATEUR DEPUIS LE TOKEN
 * @returns Infos utilisateur décodées du JWT (id, email) ou null si non connecté
 */
export const getCurrentUser = (): { id: number; email: string } | null => {
  return getUserFromToken();
};

/**
 * FORCER LA DÉCONNEXION LOCALE
 * Supprime le token localStorage et redirige vers la page de connexion
 */
export const forceLogout = (): void => {
  removeToken();
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};