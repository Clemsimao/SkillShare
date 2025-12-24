// services/search.ts
// Services de recherche d'utilisateurs et de tutoriels

import { api } from "../lib/http-client";
import { ENDPOINTS } from "../lib/config";
import type {
  SearchUsersResponse,
  SearchTutorialsResponse,
} from "../types/api";

// ... existing code ...

/**
 * Interface pour les paramètres de recherche
 */
export interface SearchParams {
  skillId?: number;
  categoryId?: number;
  q?: string;
  page?: number;
  limit?: number;
}

export const searchUsers = async (
  params: SearchParams
): Promise<SearchUsersResponse> => {
  // Validation : au moins un critère requis -> RELAXED
  // if (!params.skillId && !params.categoryId && !params.q) throw ...

  const queryParams = new URLSearchParams();
  if (params.skillId) queryParams.append("skillId", params.skillId.toString());
  if (params.categoryId) queryParams.append("categoryId", params.categoryId.toString());
  if (params.q) queryParams.append("q", params.q);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  const url = `${ENDPOINTS.SEARCH.USERS}?${queryParams.toString()}`;

  const { data } = await api.get<SearchUsersResponse>(url);
  return data;
};

/**
 * RECHERCHE TUTORIELS - Trouver des tutoriels par compétence/catégorie d'auteur
 * @param params - Paramètres de recherche
 * @returns Résultats paginés avec tutoriels et détails des auteurs
 */
export const searchTutorials = async (
  params: SearchParams
): Promise<SearchTutorialsResponse> => {
  // Validation : RELAXED
  // if (!params.skillId && !params.categoryId && !params.q) throw ...

  const queryParams = new URLSearchParams();
  if (params.skillId) queryParams.append("skillId", params.skillId.toString());
  if (params.categoryId) queryParams.append("categoryId", params.categoryId.toString());
  if (params.q) queryParams.append("q", params.q);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());

  const url = `${ENDPOINTS.SEARCH.TUTORIALS}?${queryParams.toString()}`;

  const { data } = await api.get<SearchTutorialsResponse>(url);
  return data;
};

/**
 * ================================
 * HELPERS ET UTILITAIRES
 * ================================
 */

/**
 * RECHERCHE COMBINÉE - Rechercher à la fois des utilisateurs et des tutoriels
 * @param params - Paramètres de recherche
 * @returns Promesse avec les deux types de résultats
 */
export const searchAll = async (params: SearchParams) => {
  const [usersResult, tutorialsResult] = await Promise.all([
    searchUsers(params),
    searchTutorials(params),
  ]);

  return {
    users: usersResult,
    tutorials: tutorialsResult,
  };
};

/**
 * HELPER - Construire des paramètres de recherche pour une compétence
 * @param skillId - ID de la compétence
 * @param page - Page des résultats (défaut: 1)
 * @param limit - Nombre de résultats par page (défaut: 10)
 * @returns Paramètres formatés pour la recherche
 */
export const createSkillSearchParams = (
  skillId: number,
  page: number = 1,
  limit: number = 10
): SearchParams => ({
  skillId,
  page,
  limit,
});

/**
 * HELPER - Construire des paramètres de recherche pour une catégorie
 * @param categoryId - ID de la catégorie
 * @param page - Page des résultats (défaut: 1)
 * @param limit - Nombre de résultats par page (défaut: 10)
 * @returns Paramètres formatés pour la recherche
 */
export const createCategorySearchParams = (
  categoryId: number,
  page: number = 1,
  limit: number = 10
): SearchParams => ({
  categoryId,
  page,
  limit,
});
