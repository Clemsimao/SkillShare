// lib/token.ts
// Gestionnaire central des tokens JWT côté frontend

import { API_CONFIG } from "./config";

/**
 * Stocke le token JWT dans le localStorage
 * @param token - Le token JWT reçu après login ou register
 */
export const storeToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  }
};

/**
 * Récupère le token JWT depuis le localStorage
 * @returns Le token JWT ou null si inexistant
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }
  return null;
};

/**
 * Supprime le token JWT du localStorage
 * Utilisé lors de la déconnexion ou quand le token expire
 */
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  }
};

/**
 * Vérifie si un token existe dans le localStorage
 * @returns true si un token est présent, false sinon
 */
export const hasToken = (): boolean => {
  return getToken() !== null;
};

/**
 * Décode le payload d'un token JWT sans vérification de signature
 * @param token - Token JWT à décoder
 * @returns Le payload décodé ou null si erreur
 */
export const decodeTokenPayload = (token: string): any | null => {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error("Erreur décodage token:", error);
    return null;
  }
};

/**
 * Récupère les informations utilisateur depuis le token
 * @returns Les infos user du token ou null
 */
export const getUserFromToken = (): { id: number; email: string } | null => {
  const token = getToken();
  if (!token) return null;

  const payload = decodeTokenPayload(token);
  return payload ? { id: payload.id, email: payload.email } : null;
};

/**
 * Vérifie si le token actuel est expiré
 * @returns true si expiré ou invalide, false sinon
 */
export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;

  const payload = decodeTokenPayload(token);
  if (!payload || !payload.exp) return true;

  return payload.exp * 1000 < Date.now();
};
