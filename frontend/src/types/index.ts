/**
 * ================================
 * Types partagés dans toute l'app
 * ================================
 */

// Fichier incomplet centré sur le login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  username: string;
}
