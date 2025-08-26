/**
 * ================================
 *  AUTH SERVICE
 *  Ce fichier regroupe toutes les fonctions liées
 *  à l'authentification de l'utilisateur :
 *  - Création de profil (register)
 *  - Connexion (login)
 *  - Déconnexion (logout)
 *  - Récupération du token actuel
 * ================================
 */

// Import du client HTTP Axios personnalisé et des types TypeScript
import { api } from "../http-client";
import { CreateProfileRequest, LoginRequest, AuthResponse } from "../types";

// Import des utilitaires pour gérer le token JWT dans le localStorage, depuis un fichier à part token.ts
import { storeToken, getToken, removeToken } from "../token";

/**---------------------------Creation d'un nouveau profil--------------------------------
 * Création d'un nouveau profil utilisateur
 * @param data - Données nécessaires pour créer le profil (email, password, etc.)
 * @returns Les informations utilisateur + le token d'authentification
 */

export const createProfile = async (
  data: CreateProfileRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", data);

  // On stocke automatiquement le token reçu pour rester connecté
  if (response.token) {
    storeToken(response.token);
  }

  return response;
};

/**-----------------------Connexion de l'utilisateur-------------------------------------
 * Connexion de l'utilisateur
 * @param data - Email et mot de passe
 * @returns Les informations utilisateur + le token d'authentification
 */
export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", data);

  // Sauvegarde du token pour les futures requêtes
  if (response.token) {
    storeToken(response.token);
  }

  return response;
};

/**-----------------------Deconnexion de l'utilisateur-----------------------------------
 * Déconnexion de l'utilisateur
 * - Supprime le token du localStorage
 * - Optionnel : notifier le backend si nécessaire
 */
export const logout = (): void => {
  removeToken();
  console.log("User logged out, token removed.");
};

/**
 * Récupération du token JWT actuellement stocké
 * @returns Le token si présent, sinon null
 */
export const getCurrentToken = (): string | null => {
  return getToken();
};
