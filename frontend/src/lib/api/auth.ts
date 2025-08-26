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

// fihier incomplet centré sur loging

// auth.ts - Login uniquement
import { api } from "../http-client";
import type { LoginRequest, AuthResponse } from "../../types";
import { storeToken } from "../token"; // Stocke le JWT

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", data);

  // Stocke le token pour les futures requêtes
  storeToken(response.token);

  return response;
};
