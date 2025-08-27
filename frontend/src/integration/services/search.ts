// services/search.ts
// Services de recherche d'utilisateurs et de tutoriels

import { api } from "../lib/http-client";
import { buildUrl } from "../lib/config";
import type {
  SearchUsersResponse,
  SearchTutorialsResponse,
} from "../types/api";

/**
 * ================================
 * SEARCH SERVICES
 * ================================
 * Services de recherche avancée :
 * - Recherche d'utilisateurs par compétence
 * - Recherche de tutoriels par compétence
 * - Support pagination
 * - Filtrage par catégorie ou compétence spécifique
 */

/**
 * Interface pour les paramètres de recherche
 */
export interface SearchParams {
  skillId?: number;
  categoryId?: number;
  page?: number;
  limit?: number;
}

/**
 * RECHERCHE UTILISATEURS - Trouver des utilisateurs par compétence ou catégorie
 * @param params - Paramètres de recherche
 * @returns Résultats paginés avec utilisateurs et leurs compétences
 */
export const searchUsers = async (
  params: SearchParams
): Promise<SearchUsersResponse> => {
  // Validation : au moins skillId ou categoryId requis
  if (!params.skillId && !params.categoryId) {
    throw new Error("skillId ou categoryId requis pour la recherche");
  }

  // Construction de l'URL avec paramètres
  let url = buildUrl.searchUsers(params.skillId || 0, params.page || 1);

  // Si c'est une recherche par catégorie, ajuster l'URL
  if (params.categoryId && !params.skillId) {
    url = `${url.split("?")[0]}?categoryId=${params.categoryId}&page=${params.page || 1}`;
  }

  // Ajouter limit si spécifié
  if (params.limit) {
    url += `&limit=${params.limit}`;
  }

  return api.get<SearchUsersResponse>(url);
};

/**
 * RECHERCHE TUTORIELS - Trouver des tutoriels par compétence/catégorie d'auteur
 * @param params - Paramètres de recherche
 * @returns Résultats paginés avec tutoriels et détails des auteurs
 */
export const searchTutorials = async (
  params: SearchParams
): Promise<SearchTutorialsResponse> => {
  // Validation : au moins skillId ou categoryId requis
  if (!params.skillId && !params.categoryId) {
    throw new Error("skillId ou categoryId requis pour la recherche");
  }

  // Construction de l'URL avec paramètres
  let url = buildUrl.searchTutorials(params.skillId || 0, params.page || 1);

  // Si c'est une recherche par catégorie, ajuster l'URL
  if (params.categoryId && !params.skillId) {
    url = `${url.split("?")[0]}?categoryId=${params.categoryId}&page=${params.page || 1}`;
  }

  // Ajouter limit si spécifié
  if (params.limit) {
    url += `&limit=${params.limit}`;
  }

  return api.get<SearchTutorialsResponse>(url);
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
