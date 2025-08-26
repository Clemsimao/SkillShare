/**
 * ================================
 * Types partagés dans toute l'app
 * ================================
 */

// ---- AUTH ----

// Données pour se connecter
export interface LoginRequest {
  email: string;
  password: string;
}

// Données pour créer un profil
export interface CreateProfileRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  birthdate: string; // format YYYY-MM-DD
}

// Réponse après login/register
export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
  };
}

// ---- TUTORIAL ----
export interface CreateTutorialRequest {
  title: string;
  content: string;
  video_link: string;
}

export interface TutorialResponse {
  id: string;
  title: string;
  content: string;
  video_link: string;
  createdAt: string;
  updatedAt: string;
}
