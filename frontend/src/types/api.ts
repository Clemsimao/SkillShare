// ============================================================================
// TYPES DE BASE - Les fondations de toute réponse API
// ============================================================================

// Type générique pour toutes les réponses du backend
// T représente le type des données spécifiques (User, Skill, etc.)
export interface ApiResponse<T = unknown> {
 readonly success: boolean;    // true/false selon le succès
 readonly message: string;     // Message explicatif du backend
 readonly data?: T;           // Données optionnelles (absentes en cas d'erreur)
}

// Réponse avec pagination (pour les listes)
// Étend ApiResponse en ajoutant les infos de pagination
export interface PaginatedResponse<T> extends ApiResponse<T> {
 readonly pagination?: {
   readonly page: number;
   readonly totalCount: number;
   readonly totalPages: number;
   readonly hasNext: boolean;
 };
}

// ============================================================================
// TYPES D'AUTHENTIFICATION - Gestion des connexions/inscriptions
// ============================================================================

// Union type pour les réponses d'auth - soit succès soit échec
export type AuthResponse = 
 | AuthSuccessResponse
 | AuthErrorResponse;

// Quand l'auth réussit
interface AuthSuccessResponse {
 readonly success: true;
 readonly message: string;
 readonly user: User;          // Infos utilisateur
 readonly token: string;       // JWT pour futures requêtes
}

// Quand l'auth échoue
interface AuthErrorResponse {
 readonly success: false;
 readonly message: string;
 readonly errors?: string[];   // Erreurs de validation optionnelles
}

// Données pour créer un compte
export interface RegisterData {
 readonly firstName: string;
 readonly lastName: string;
 readonly username: string;
 readonly email: string;
 readonly password: string;
 readonly birthdate: string;   // Format: 'YYYY-MM-DD'
}

// Données pour se connecter
export interface LoginData {
 readonly email: string;
 readonly password: string;
}

// ============================================================================
// ENTITÉS MÉTIER - Structures de données principales
// ============================================================================

// Utilisateur complet (toutes les infos possibles)
export interface User {
 readonly id: number;
 readonly email: string;
 readonly firstName: string;
 readonly lastName: string;
 readonly username: string;
 readonly birthdate?: string;
 readonly gender?: 'M' | 'F' | 'A';      // Union type strict
 readonly profilePicture?: string;
 readonly content?: string;              // Bio/description
 readonly createdAt?: string;
 readonly updatedAt?: string;
}

// Version publique d'un utilisateur (infos limitées)
export interface PublicUser {
 readonly id: number;
 readonly firstName: string;
 readonly lastName: string;
 readonly username: string;
 readonly profilePicture?: string;
 readonly skills?: Skill[];
}

// Compétence 
export interface Skill {
 readonly id: number;
 readonly title: string;              
 readonly category: string | Category;  // Peut être string ou objet
}

// Catégorie de compétence
export interface Category {
 readonly id: number;
 readonly title: string;
}

// Tutoriel
export interface Tutorial {
 readonly id: number;
 readonly title: string;
 readonly content: string;
 readonly picture?: string;
 readonly videoLink?: string;
 readonly author: {
   readonly id: number;
   readonly username: string;
   readonly profilePicture?: string;
 };
 readonly createdAt: string;
 readonly updatedAt: string;
 readonly publishedAt?: string;
}

// Commentaire
export interface Comment {
 readonly id: number;
 readonly content: string;
 readonly user_id: number;
 readonly tutorial_id: number;
 readonly is_author: boolean;    // L'auteur du tutoriel ?
 readonly created_at: string;
 readonly updated_at: string;
}

// ============================================================================
// TYPES UTILITAIRES - Helpers pour manipuler les données
// ============================================================================

// Ces "utility types" transforment automatiquement des types existants
// au lieu de réécrire manuellement chaque interface. Cela évite :
// - La duplication de code
// - Les erreurs de synchronisation quand on modifie l'interface originale
// - La maintenance fastidieuse de multiples interfaces similaires

// Crée un type avec seulement les champs modifiables d'un User
export type UpdateUserData = Partial<Pick<User, 'firstName' | 'lastName' | 'profilePicture' | 'content'>>;

// Type pour créer un tutoriel (sans id, dates auto)
export type CreateTutorialData = Pick<Tutorial, 'title' | 'content' | 'picture' | 'videoLink'>;

// Type pour mettre à jour un tutoriel
export type UpdateTutorialData = Partial<CreateTutorialData>;

// ============================================================================
// TYPES D'ÉTAT - Gestion des états de l'application
// ============================================================================

// États possibles d'une requête API
export type ApiStatus = 'idle' | 'loading' | 'success' | 'error';

// État complet d'une requête
export interface ApiState<T> {
 readonly data: T | null;
 readonly status: ApiStatus;
 readonly error: string | null;
 readonly isLoading: boolean;
 readonly isSuccess: boolean;
 readonly isError: boolean;
}

// ============================================================================
// TYPES D'ERREUR - Gestion standardisée des erreurs
// ============================================================================

// Erreur API standardisée
export interface ApiError {
 readonly success: false;
 readonly message: string;
 readonly statusCode?: number;
 readonly errors?: string[];
 readonly timestamp?: string;
}

// Types d'erreurs spécifiques
export type ValidationError = ApiError & {
 readonly errors: string[];    // Erreurs de validation obligatoires
};

export type AuthError = ApiError & {
 readonly statusCode: 401 | 403;  // Codes d'auth spécifiques
};

// ============================================================================
// TYPES DE RÉPONSES SPÉCIFIQUES - Pour chaque endpoint
// ============================================================================

// GET /api/skills
export type SkillsResponse = ApiResponse<{
 skills: Skill[];
 count: number;
}>;

// GET /api/users/examples
export type ExampleUsersResponse = ApiResponse<{
 users: PublicUser[];
 count: number;
}>;

// GET /api/tutorials/landing
export type LandingTutorialResponse = ApiResponse<{
 tutorial: Tutorial;
}>;

// GET /api/search/users
export type SearchUsersResponse = PaginatedResponse<{
 users: PublicUser[];
}>;

// GET /api/auth/profil
export type ProfileResponse = ApiResponse<{
 user: User;
}>;

// ============================================================================
// TYPES POUR LES HOOKS - Interface des hooks React
// ============================================================================

// Interface du hook useAuth
export interface UseAuthReturn {
 readonly user: User | null;
 readonly isAuthenticated: boolean;
 readonly isLoading: boolean;
 readonly error: string | null;
 readonly login: (email: string, password: string) => Promise<void>;
 readonly register: (data: RegisterData) => Promise<void>;
 readonly logout: () => void;
 readonly refreshProfile: () => Promise<void>;
 readonly clearError: () => void;
}

// Interface générique pour les hooks API
export interface UseApiReturn<T> {
 readonly data: T | null;
 readonly isLoading: boolean;
 readonly error: string | null;
 readonly refetch: () => Promise<void>;
}

// ============================================================================
// CONSTANTES DE TYPES - Valeurs fixes typées
// ============================================================================

// Méthodes HTTP supportées
export const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'] as const;
export type HttpMethod = typeof HTTP_METHODS[number];

// Genres possibles
export const GENDERS = ['M', 'F', 'A'] as const;
export type Gender = typeof GENDERS[number];

// États d'API
export const API_STATUSES = ['idle', 'loading', 'success', 'error'] as const;
export type ApiStatusType = typeof API_STATUSES[number];