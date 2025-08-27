// services/public.ts
// Services publics ne nécessitant pas d'authentification

import { api } from "../lib/http-client";
import { ENDPOINTS } from "../lib/config";
import type {
  SkillsResponse,
  CategoriesResponse,
  TutorialResponse,
  User,
  ApiResponse,
} from "../types/api";

/**
 * ================================
 * SERVICES PUBLICS
 * ================================
 * Endpoints accessibles sans authentification :
 * - Récupération des compétences
 * - Récupération des catégories
 * - Tutoriel pour landing page
 * - Profils exemple pour landing page
 * - Status de l'API
 */

/**
 * COMPÉTENCES - Récupérer toutes les compétences disponibles
 * @returns Liste des compétences avec leurs catégories
 */
export const getSkills = async (): Promise<SkillsResponse> => {
  return api.get<SkillsResponse>(ENDPOINTS.PUBLIC.SKILLS);
};

/**
 * CATÉGORIES - Récupérer toutes les catégories de compétences
 * @returns Liste des catégories
 */
export const getCategories = async (): Promise<CategoriesResponse> => {
  return api.get<CategoriesResponse>(ENDPOINTS.PUBLIC.SKILLS_CATEGORIES);
};

/**
 * TUTORIEL LANDING - Récupérer le tutoriel à afficher sur la landing page
 * @returns Le dernier tutoriel publié ou un tutoriel mis en avant
 */
export const getLandingTutorial = async (): Promise<TutorialResponse> => {
  return api.get<TutorialResponse>(ENDPOINTS.PUBLIC.TUTORIALS_LANDING);
};

/**
 * PROFILS EXEMPLE - Récupérer des profils d'utilisateurs pour la landing page
 * @param limit - Nombre maximum de profils à récupérer (défaut: 6)
 * @returns Liste des profils exemple avec leurs compétences
 */
export const getExampleProfiles = async (
  limit: number = 6
): Promise<{ success: boolean; users: User[]; count: number }> => {
  return api.get<{ success: boolean; users: User[]; count: number }>(
    `${ENDPOINTS.PUBLIC.USERS_EXAMPLES}?limit=${limit}`
  );
};

/**
 * SANTÉ DE L'API - Vérifier que l'API fonctionne correctement
 * @returns Status de l'API avec timestamp
 */
export const getApiHealth = async (): Promise<
  ApiResponse & { timestamp: string }
> => {
  return api.get<ApiResponse & { timestamp: string }>(ENDPOINTS.PUBLIC.HEALTH);
};

/**
 * Helper : Vérifier si l'API est accessible
 * @returns true si l'API répond, false sinon
 */
export const checkApiAvailability = async (): Promise<boolean> => {
  try {
    await getApiHealth();
    return true;
  } catch (error) {
    console.warn("API non accessible:", error);
    return false;
  }
};
