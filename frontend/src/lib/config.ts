// Configuration API moderne avec const assertions
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
  TIMEOUT: 10_000, // 10 secondes
  TOKEN_KEY: "skillswap_token", // changer en skillShare
  RETRY_ATTEMPTS: 3,
} as const;

// Endpoints organisés par modules avec const assertions
export const ENDPOINTS = {
  //  Authentication
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    LOGOUT: "/api/auth/logout",
    PROFILE: "/api/auth/profil",
  },

  //  Public endpoints (pas d'auth requise)
  PUBLIC: {
    HEALTH: "/api/health",
    SKILLS: "/api/skills",
    SKILLS_CATEGORIES: "/api/skills/categories",
    TUTORIALS_LANDING: "/api/tutorials/landing",
    USERS_EXAMPLES: "/api/users/examples",
  },

  //  Users management
  USERS: {
    PUBLIC_PROFILE: "/api/users/profile", // + /:id
    UPDATE_PROFILE: "/api/users/profile",
    DELETE_PROFILE: "/api/users/profile",
    ADD_SKILL: "/api/users/skills",
    REMOVE_SKILL: "/api/users/skills", // + /:skillId
    ADD_INTEREST: "/api/users/interests",
    REMOVE_INTEREST: "/api/users/interests", // + /:skillId
  },

  // 📚 Tutorials
  TUTORIALS: {
    LIST: "/api/tutorials",
    DETAIL: "/api/tutorials", // + /:id
    CREATE: "/api/tutorials",
    UPDATE: "/api/tutorials", // + /:id
    DELETE: "/api/tutorials", // + /:id
    UPLOAD_IMAGE: "/api/tutorials", // + /:id/image
  },

  //  Search (protected)
  SEARCH: {
    USERS: "/api/search/users", // ?skillId={ID}&page=1
    TUTORIALS: "/api/search/tutorials", // ?skillId={ID}&page=1
  },

  //  Comments
  COMMENTS: {
    BY_TUTORIAL: "/api/comments/tutorial", // + /:tutorialId
    CREATE: "/api/comments",
    UPDATE: "/api/comments", // + /:id
    DELETE: "/api/comments", // + /:id
  },

  //  Follow system (protected)
  FOLLOW: {
    TOGGLE: "/api/follow", // + /:id
    FOLLOWING: "/api/follow/following",
    FOLLOWERS: "/api/follow/followers",
  },

  //  Ratings system (protected)
  RATINGS: {
    RATE_USER: "/api/ratings/users", // + /:id/rate
    USER_RATINGS_LIST: "/api/ratings/users", // + /:id/ratings
    USER_RATING_AVERAGE: "/api/ratings/users", // + /:id/rating
    RATE_TUTORIAL: "/api/ratings/tutorials", // + /:id/rate
    TUTORIAL_RATINGS: "/api/ratings/tutorials", // + /:id/ratings
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
  SLOW: 30_000, // File uploads
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
// POURQUOI ? Éviter les erreurs de typo et centraliser la logique des URLs
// COMMENT ? Functions qui prennent des paramètres et retournent l'URL complète

export const buildUrl = {
  // USER PROFILES
  // Sans helper : `'/api/users/profile/' + userId` (risque d'erreur)
  // Avec helper : buildUrl.userProfile(123) → '/api/users/profile/123'
  userProfile: (id: number) => `${ENDPOINTS.USERS.PUBLIC_PROFILE}/${id}`,

  // TUTORIALS - Toutes les actions avec ID
  // Exemple : buildUrl.tutorialDetail(456) → '/api/tutorials/456'
  tutorialDetail: (id: number) => `${ENDPOINTS.TUTORIALS.DETAIL}/${id}`,
  tutorialUpdate: (id: number) => `${ENDPOINTS.TUTORIALS.UPDATE}/${id}`,
  tutorialDelete: (id: number) => `${ENDPOINTS.TUTORIALS.DELETE}/${id}`,

  // UPLOAD - Construction URL complexe
  // Exemple : buildUrl.tutorialUploadImage(789) → '/api/tutorials/789/image'
  tutorialUploadImage: (id: number) =>
    `${ENDPOINTS.TUTORIALS.UPLOAD_IMAGE}/${id}/image`,

  //  USER SKILLS/INTERESTS - Remove actions avec skillId
  // Exemple : buildUrl.removeUserSkill(5) → '/api/users/skills/5'
  removeUserSkill: (skillId: number) =>
    `${ENDPOINTS.USERS.REMOVE_SKILL}/${skillId}`,
  removeUserInterest: (skillId: number) =>
    `${ENDPOINTS.USERS.REMOVE_INTEREST}/${skillId}`,

  //  COMMENTS - CRUD avec IDs
  // Exemple : buildUrl.commentsByTutorial(123) → '/api/comments/tutorial/123'
  commentsByTutorial: (tutorialId: number) =>
    `${ENDPOINTS.COMMENTS.BY_TUTORIAL}/${tutorialId}`,
  updateComment: (id: number) => `${ENDPOINTS.COMMENTS.UPDATE}/${id}`,
  deleteComment: (id: number) => `${ENDPOINTS.COMMENTS.DELETE}/${id}`,

  //  FOLLOW SYSTEM
  // Exemple : buildUrl.toggleFollow(456) → '/api/follow/456'
  toggleFollow: (id: number) => `${ENDPOINTS.FOLLOW.TOGGLE}/${id}`,

  //  RATINGS - URLs complexes avec actions spécifiques
  // Exemple : buildUrl.rateUser(123) → '/api/ratings/users/123/rate'
  rateUser: (id: number) => `${ENDPOINTS.RATINGS.RATE_USER}/${id}/rate`,
  userRatingsList: (id: number) =>
    `${ENDPOINTS.RATINGS.USER_RATINGS_LIST}/${id}/ratings`,
  userRatingAverage: (id: number) =>
    `${ENDPOINTS.RATINGS.USER_RATING_AVERAGE}/${id}/rating`,
  rateTutorial: (id: number) => `${ENDPOINTS.RATINGS.RATE_TUTORIAL}/${id}/rate`,
  tutorialRatings: (id: number) =>
    `${ENDPOINTS.RATINGS.TUTORIAL_RATINGS}/${id}/ratings`,

  //  SEARCH - URLs avec query parameters
  // ⚡ BONUS : Gestion des paramètres GET automatique !
  // Exemple : buildUrl.searchUsers(1, 2) → '/api/search/users?skillId=1&page=2'
  searchUsers: (skillId: number, page = 1) =>
    `${ENDPOINTS.SEARCH.USERS}?skillId=${skillId}&page=${page}`,
  searchTutorials: (skillId: number, page = 1) =>
    `${ENDPOINTS.SEARCH.TUTORIALS}?skillId=${skillId}&page=${page}`,
} as const;

//  UTILISATION DANS LE CODE :
//
//  AVANT (Error-prone) :
// const url = '/api/users/profile/' + userId;  // Typo possible
// const url = `/api/tutorials/${id}/image`;    // Oubli du endpoint
//
//  MAINTENANT (Type-safe) :
// const url = buildUrl.userProfile(userId);        // Autocomplete + validation
// const url = buildUrl.tutorialUploadImage(id);    // Plus de typos
// const url = buildUrl.searchUsers(skillId, 2);    // Parameters automatiques
//
//  AVANTAGES :
// 1. Type safety - TypeScript valide les paramètres
// 2. Autocomplete - IDE suggère les functions disponibles
// 3. Refactoring - Changer un endpoint = 1 seul endroit à modifier
// 4. Consistency - Même format partout dans l'app
// 5. Testing - Plus facile à mocker et tester

// Utilitaire URL robuste (évite les doubles slash et gère les bases absolues)
export const makeUrl = (path: string) =>
  new URL(path, API_CONFIG.BASE_URL).toString();

// Exemple d'utilisation (si tu veux l’exposer à la place de buildUrl.*):
// makeUrl(ENDPOINTS.RATINGS.RATE_USER + '/123/rate')

// Header d'auth générique (si tu stockes le token)
export const withAuth = (headers: Record<string, string> = {}) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem(API_CONFIG.TOKEN_KEY)
      : null;

  return token ? { ...headers, Authorization: `Bearer ${token}` } : headers;
};
