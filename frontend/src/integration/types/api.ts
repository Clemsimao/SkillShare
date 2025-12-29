// ============================================================================
// TYPES DE BASE - Format standard des réponses API
// ============================================================================

export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly message: string;
  readonly data?: T;
}

// Réponses spécifiques avec données
export interface AuthResponse extends ApiResponse {
  readonly user: User;
  readonly token: string;
}

export interface SkillsResponse extends ApiResponse {
  readonly skills: Skill[];
  readonly count: number;
}

export interface CategoriesResponse extends ApiResponse {
  readonly categories: Category[];
  readonly count: number;
}

export interface SearchUsersResponse extends ApiResponse {
  readonly users: User[];
  readonly pagination: Pagination;
}

export interface SearchTutorialsResponse extends ApiResponse {
  readonly tutorials: Tutorial[];
  readonly pagination: Pagination;
}

export interface TutorialsResponse extends ApiResponse {
  readonly tutorials: Tutorial[];
}

export interface TutorialResponse extends ApiResponse {
  readonly tutorial: Tutorial;
}

export interface CommentsResponse extends ApiResponse {
  readonly data: Comment[];
}

// ============================================================================
// ENTITÉS MÉTIER - Structures exactes du backend
// ============================================================================

export interface User {
  readonly id: number;
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly birthdate: string; // Obligatoire - allowNull: false dans le modèle
  readonly content?: string | null;
  readonly location?: string | null;
  readonly gender?: "M" | "F" | "A" | null;
  readonly profilePicture?: string | null;
  readonly createdAt: string; // Obligatoire - allowNull: false dans le modèle
  readonly updatedAt: string; // Obligatoire - allowNull: false dans le modèle
  readonly skills?: Skill[];
  readonly interests?: Skill[];
}

export interface Skill {
  readonly id: number;
  readonly title: string; // TOUJOURS 'title', jamais 'name'
  readonly category: Category | string;
}

export interface Category {
  readonly id: number;
  readonly title: string;
}

export interface Tutorial {
  readonly id: number;
  readonly title: string;
  readonly content: string;
  readonly picture?: string | null;
  readonly videoLink?: string | null;
  readonly author: {
    readonly id: number;
    readonly username: string;
    readonly profilePicture?: string | null;
  };
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly publishedAt?: string;
}

export interface Comment {
  readonly comment_id: number;
  readonly content: string;
  readonly user_id: number;
  readonly tutorial_id: number;
  readonly is_author: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  readonly published_at: string;
  readonly author: {
    readonly user_id: number;
    readonly username: string;
    readonly profile_picture?: string | null;
  };
}

export interface Pagination {
  readonly page: number;
  readonly totalCount: number;
  readonly totalPages: number;
  readonly hasNext: boolean;
}

// ============================================================================
// TYPES DE REQUÊTE - Pour envoyer des données au backend
// ============================================================================

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly username: string;
  readonly birthdate: string;
}

export interface CreateTutorialRequest {
  readonly title: string;
  readonly content: string;
  readonly picture?: string;
  readonly videoLink?: string;
}

export interface UpdateTutorialRequest {
  readonly title?: string;
  readonly content?: string;
  readonly picture?: string;
  readonly videoLink?: string;
}

export interface CreateCommentRequest {
  readonly tutorial_id: number;
  readonly content: string;
}

export interface UpdateCommentRequest {
  readonly content: string;
}

export interface AddSkillRequest {
  readonly skillId: number;
}

// ============================================================================
// TYPES UTILITAIRES - Helpers pour manipuler les données
// ============================================================================

// Type pour mettre à jour un profil (champs modifiables uniquement)
export type UpdateUserData = Partial<
  Pick<User, "firstName" | "lastName" | "content" | "gender" | "location">
>;

// Type pour créer un tutoriel (sans id, dates auto-générées)
export type CreateTutorialData = Pick<
  Tutorial,
  "title" | "content" | "picture" | "videoLink"
>;

// Type pour mettre à jour un tutoriel (tous champs optionnels)
export type UpdateTutorialData = Partial<CreateTutorialData>;

// Méthodes HTTP supportées
export const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE"] as const;
export type HttpMethod = (typeof HTTP_METHODS)[number];

// Genres possibles (basés sur le modèle User)
export const GENDERS = ["M", "F", "A"] as const;
export type Gender = (typeof GENDERS)[number];

// États d'API pour les hooks
export const API_STATUSES = ["idle", "loading", "success", "error"] as const;
export type ApiStatusType = (typeof API_STATUSES)[number];

// ============================================================================
// TYPES D'ERREUR - Gestion des erreurs API
// ============================================================================

export interface ApiError {
  readonly success: false;
  readonly message: string;
  readonly code?: string;
  readonly details?: unknown;
}

export interface ValidationError extends ApiError {
  readonly code: "VALIDATION_ERROR";
  readonly fields?: Record<string, string[]>;
}

export interface AuthError extends ApiError {
  readonly code: "AUTH_ERROR";
}

export interface NotFoundError extends ApiError {
  readonly code: "NOT_FOUND";
}
