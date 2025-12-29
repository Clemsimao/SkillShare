// lib/config.ts
// Configuration API corrigée basée sur l'analyse exhaustive du backend

// Configuration API moderne avec const assertions
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  TIMEOUT: 10_000, // 10 secondes
  TOKEN_KEY: "skillswap_token",
  RETRY_ATTEMPTS: 3,
} as const;

// Endpoints organisés par modules - CORRIGÉS selon l'analyse backend
export const ENDPOINTS = {
  // Authentication - CORRECTION: /profile au lieu de /profil
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    PROFILE: "/api/auth/profile", // ✅ CORRIGÉ : anglais cohérent
  },

  // Public endpoints (pas d'auth requise)
  PUBLIC: {
    HEALTH: "/api/health",
    SKILLS: "/api/skills",
    SKILLS_CATEGORIES: "/api/skills/categories",
    TUTORIALS_LANDING: "/api/tutorials/landing",
    TUTORIALS_LATEST: "/api/tutorials/latest",
    USERS_EXAMPLES: "/api/users/examples",
  },

  // Users management
  USERS: {
    PUBLIC_PROFILE: "/api/users/profile", // + /:id
    UPDATE_PROFILE: "/api/users/profile",
    DELETE_PROFILE: "/api/users/profile",
    UPLOAD_PICTURE: "/api/users/profile/picture",
    ADD_SKILL: "/api/users/skills",
    REMOVE_SKILL: "/api/users/skills", // + /:skillId
    ADD_INTEREST: "/api/users/interests",
    REMOVE_INTEREST: "/api/users/interests", // + /:skillId
  },

  // Tutorials - CORRECTION: champ 'picture' au lieu de 'image_url'
  TUTORIALS: {
    LIST: "/api/tutorials",
    DETAIL: "/api/tutorials", // + /:id
    CREATE: "/api/tutorials",
    UPDATE: "/api/tutorials", // + /:id
    DELETE: "/api/tutorials", // + /:id
    UPLOAD_IMAGE: "/api/tutorials", // + /:id/image
  },

  // Search (protected)
  SEARCH: {
    USERS: "/api/search/users", // ?skillId={ID}&page=1
    TUTORIALS: "/api/search/tutorials", // ?skillId={ID}&page=1
  },

  // Comments
  COMMENTS: {
    BY_TUTORIAL: "/api/comments/tutorial", // + /:tutorialId
    CREATE: "/api/comments",
    UPDATE: "/api/comments", // + /:id
    DELETE: "/api/comments", // + /:id
  },
} as const;

// Headers par défaut
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;

// Configuration des timeouts par type de requête
export const TIMEOUTS = {
  FAST: 5_000, // Auth, search
  NORMAL: 10_000, // CRUD operations
  SLOW: 300_000, // File uploads (5 min)
} as const;

// Status codes à gérer spécifiquement
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Configuration environnements
export const ENV = {
  DEVELOPMENT: process.env.NODE_ENV === "development",
  PRODUCTION: process.env.NODE_ENV === "production",
  TEST: process.env.NODE_ENV === "test",
} as const;

// Helper functions pour construire les URLs dynamiques
export const buildUrl = {
  // USER PROFILES
  userProfile: (id: number) => `${ENDPOINTS.USERS.PUBLIC_PROFILE}/${id}`,

  // TUTORIALS - Toutes les actions avec ID
  tutorialDetail: (id: number) => `${ENDPOINTS.TUTORIALS.DETAIL}/${id}`,
  tutorialUpdate: (id: number) => `${ENDPOINTS.TUTORIALS.UPDATE}/${id}`,
  tutorialDelete: (id: number) => `${ENDPOINTS.TUTORIALS.DELETE}/${id}`,
  tutorialUploadImage: (id: number) =>
    `${ENDPOINTS.TUTORIALS.UPLOAD_IMAGE}/${id}/image`,

  // USER SKILLS/INTERESTS - Remove actions avec skillId
  removeUserSkill: (skillId: number) =>
    `${ENDPOINTS.USERS.REMOVE_SKILL}/${skillId}`,
  removeUserInterest: (skillId: number) =>
    `${ENDPOINTS.USERS.REMOVE_INTEREST}/${skillId}`,

  // COMMENTS - CRUD avec IDs
  commentsByTutorial: (tutorialId: number) =>
    `${ENDPOINTS.COMMENTS.BY_TUTORIAL}/${tutorialId}`,
  updateComment: (id: number) => `${ENDPOINTS.COMMENTS.UPDATE}/${id}`,
  deleteComment: (id: number) => `${ENDPOINTS.COMMENTS.DELETE}/${id}`,

  // SEARCH - URLs avec query parameters
  searchUsers: (skillId: number, page = 1) =>
    `${ENDPOINTS.SEARCH.USERS}?skillId=${skillId}&page=${page}`,
  searchTutorials: (skillId: number, page = 1) =>
    `${ENDPOINTS.SEARCH.TUTORIALS}?skillId=${skillId}&page=${page}`,
} as const;

// Utilitaire URL robuste
export const makeUrl = (path: string) =>
  new URL(path, API_CONFIG.BASE_URL).toString();

// Header d'auth générique
export const withAuth = (headers: Record<string, string> = {}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(API_CONFIG.TOKEN_KEY)
      : null;

  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};
