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
 * @returns {Promise<SkillsResponse>} Liste des compétences avec leurs catégories
 * @throws {Error} Si l'API est inaccessible ou retourne une erreur
 * @example
 * ```typescript
 * const skills = await getSkills();
 * console.log(skills.skills); // Array<Skill>
 * ```
 */
export const getSkills = async (): Promise<SkillsResponse> => {
  const { data } = await api.get<SkillsResponse>(ENDPOINTS.PUBLIC.SKILLS);
  return data;
};

/**
 * CATÉGORIES - Récupérer toutes les catégories de compétences
 * @returns {Promise<CategoriesResponse>} Liste des catégories avec nombre de compétences
 * @throws {Error} Si l'API est inaccessible ou retourne une erreur
 * @example
 * ```typescript
 * const categories = await getCategories();
 * console.log(categories.categories); // Array<Category>
 * ```
 */
export const getCategories = async (): Promise<CategoriesResponse> => {
  const { data } = await api.get<CategoriesResponse>(ENDPOINTS.PUBLIC.SKILLS_CATEGORIES);
  return data;
};

/**
 * TUTORIEL LANDING - Récupérer le tutoriel à afficher sur la landing page
 * @returns {Promise<TutorialResponse>} Le dernier tutoriel publié ou un tutoriel mis en avant
 * @throws {Error} Si l'API est inaccessible ou aucun tutoriel disponible
 * @example
 * ```typescript
 * const featuredTutorial = await getLandingTutorial();
 * console.log(featuredTutorial.tutorial.title);
 * ```
 */
export const getLandingTutorial = async (): Promise<TutorialResponse> => {
  const { data } = await api.get<TutorialResponse>(ENDPOINTS.PUBLIC.TUTORIALS_LANDING);
  return data;
};

/**
 * DERNIERS TUTORIELS - Récupérer les 3 derniers tutoriels (Landing Page)
 * @returns {Promise<{success: boolean, tutorials: Tutorial[]}>}
 */
export const getLatestTutorials = async (): Promise<{ success: boolean, tutorials: any[] }> => {
  // Note: 'any' pour Tutorial si non importé, ou on ajoute Tutorial dans les imports si manquant.
  // Mais Tutorial est déjà importé mais peut être pas le type tableau dans TutorialResponse
  const { data } = await api.get<{ success: boolean; tutorials: any[] }>(ENDPOINTS.PUBLIC.TUTORIALS_LATEST);
  return data;
};

/**
 * PROFILS EXEMPLE - Récupérer des profils d'utilisateurs pour la landing page
 * @param {number} [limit=6] - Nombre maximum de profils à récupérer (entre 1 et 20)
 * @returns {Promise<{success: boolean, users: User[], count: number}>} Liste des profils exemple avec leurs compétences et nombre total
 * @throws {Error} Si l'API est inaccessible ou le paramètre limit invalide
 * @example
 * ```typescript
 * const profiles = await getExampleProfiles(4);
 * console.log(profiles.users); // Array<User> avec 4 utilisateurs max
 * ```
 */
export const getExampleProfiles = async (
  limit: number = 6
): Promise<{ success: boolean; users: User[]; count: number }> => {
  const { data } = await api.get<{ success: boolean; users: User[]; count: number }>(
    `${ENDPOINTS.PUBLIC.USERS_EXAMPLES}?limit=${limit}`
  );
  return data;
};

/**
 * SANTÉ DE L'API - Vérifier que l'API fonctionne correctement
 * @returns {Promise<ApiResponse & {timestamp: string}>} Status de l'API avec timestamp de la réponse
 * @throws {Error} Si l'API est complètement inaccessible
 * @example
 * ```typescript
 * const health = await getApiHealth();
 * console.log(health.success); // true si API opérationnelle
 * console.log(health.timestamp); // ISO timestamp
 * ```
 */
export const getApiHealth = async (): Promise<ApiResponse & { timestamp: string }> => {
  const { data } = await api.get<ApiResponse & { timestamp: string }>(ENDPOINTS.PUBLIC.HEALTH);
  return data;
};

/**
 * HELPER - Vérifier si l'API est accessible (version silencieuse)
 * @returns {Promise<boolean>} true si l'API répond correctement, false sinon
 * @example
 * ```typescript
 * const isOnline = await checkApiAvailability();
 * if (!isOnline) {
 *   // Afficher message d'erreur offline
 * }
 * ```
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