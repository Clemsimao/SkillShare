// Hook pour la recherche avancée d'utilisateurs et de tutoriels

import { useState, useCallback, useMemo } from "react";
import {
  searchUsers,
  searchTutorials,
  searchAll,
  createSkillSearchParams,
  createCategorySearchParams,
  type SearchParams,
} from "../services/search";
import { useApi } from "./use-api";
import type { 
  User, 
  Tutorial, 
  Pagination,
  ApiStatusType 
} from "../types/api";

interface SearchResults {
  users: User[];
  tutorials: Tutorial[];
  usersPagination: Pagination | null;
  tutorialsPagination: Pagination | null;
}

interface UseSearchReturn {
  // Résultats de recherche
  results: SearchResults;
  status: ApiStatusType;
  error: string | null;
  isLoading: boolean;
  hasResults: boolean;

  // Actions de recherche
  searchBySkill: (skillId: number, page?: number) => Promise<boolean>;
  searchByCategory: (categoryId: number, page?: number) => Promise<boolean>;
  searchUsersOnly: (params: SearchParams) => Promise<boolean>;
  searchTutorialsOnly: (params: SearchParams) => Promise<boolean>;
  loadMore: (type: 'users' | 'tutorials') => Promise<boolean>;

  // Gestion de l'historique et état
  clearResults: () => void;
  currentParams: SearchParams | null;
}

/**
 * Hook de recherche avancée
 * Gère les recherches d'utilisateurs et de tutoriels avec pagination
 */
export const useSearch = (): UseSearchReturn => {
  const [results, setResults] = useState<SearchResults>({
    users: [],
    tutorials: [],
    usersPagination: null,
    tutorialsPagination: null,
  });
  const [currentParams, setCurrentParams] = useState<SearchParams | null>(null);

  // Hooks API pour les différents types de recherche
  const searchAllApi = useApi(searchAll);
  const searchUsersApi = useApi(searchUsers);
  const searchTutorialsApi = useApi(searchTutorials);

  // État global
  const isLoading = [
    searchAllApi.isLoading,
    searchUsersApi.isLoading,
    searchTutorialsApi.isLoading,
  ].some(Boolean);

  const error = searchAllApi.error || 
                searchUsersApi.error || 
                searchTutorialsApi.error;

  const status: ApiStatusType = isLoading ? "loading" : 
                               error ? "error" : "success";

  const hasResults = useMemo(() => {
    return results.users.length > 0 || results.tutorials.length > 0;
  }, [results.users.length, results.tutorials.length]);

  /**
   * RECHERCHE PAR COMPÉTENCE - Utilisateurs et tutoriels
   */
  const searchBySkill = useCallback(async (
    skillId: number, 
    page = 1
  ): Promise<boolean> => {
    const params = createSkillSearchParams(skillId, page);
    setCurrentParams(params);

    const result = await searchAllApi.execute(params);
    if (result) {
      if (page === 1) {
        // Nouvelle recherche
        setResults({
          users: result.users.users,
          tutorials: result.tutorials.tutorials,
          usersPagination: result.users.pagination,
          tutorialsPagination: result.tutorials.pagination,
        });
      } else {
        // Ajout de résultats (pagination)
        setResults(prev => ({
          users: [...prev.users, ...result.users.users],
          tutorials: [...prev.tutorials, ...result.tutorials.tutorials],
          usersPagination: result.users.pagination,
          tutorialsPagination: result.tutorials.pagination,
        }));
      }
      return true;
    }
    return false;
  }, [searchAllApi]);

  /**
   * RECHERCHE PAR CATÉGORIE - Utilisateurs et tutoriels
   */
  const searchByCategory = useCallback(async (
    categoryId: number, 
    page = 1
  ): Promise<boolean> => {
    const params = createCategorySearchParams(categoryId, page);
    setCurrentParams(params);

    const result = await searchAllApi.execute(params);
    if (result) {
      if (page === 1) {
        setResults({
          users: result.users.users,
          tutorials: result.tutorials.tutorials,
          usersPagination: result.users.pagination,
          tutorialsPagination: result.tutorials.pagination,
        });
      } else {
        setResults(prev => ({
          users: [...prev.users, ...result.users.users],
          tutorials: [...prev.tutorials, ...result.tutorials.tutorials],
          usersPagination: result.users.pagination,
          tutorialsPagination: result.tutorials.pagination,
        }));
      }
      return true;
    }
    return false;
  }, [searchAllApi]);

  /**
   * RECHERCHE UTILISATEURS SEULEMENT
   */
  const searchUsersOnly = useCallback(async (params: SearchParams): Promise<boolean> => {
    setCurrentParams(params);

    const result = await searchUsersApi.execute(params);
    if (result) {
      const isNewSearch = params.page === 1 || !params.page;
      
      setResults(prev => ({
        ...prev,
        users: isNewSearch ? result.users : [...prev.users, ...result.users],
        usersPagination: result.pagination,
      }));
      return true;
    }
    return false;
  }, [searchUsersApi]);

  /**
   * RECHERCHE TUTORIELS SEULEMENT
   */
  const searchTutorialsOnly = useCallback(async (params: SearchParams): Promise<boolean> => {
    setCurrentParams(params);

    const result = await searchTutorialsApi.execute(params);
    if (result) {
      const isNewSearch = params.page === 1 || !params.page;
      
      setResults(prev => ({
        ...prev,
        tutorials: isNewSearch ? result.tutorials : [...prev.tutorials, ...result.tutorials],
        tutorialsPagination: result.pagination,
      }));
      return true;
    }
    return false;
  }, [searchTutorialsApi]);

  /**
   * CHARGER PLUS DE RÉSULTATS (pagination)
   */
  const loadMore = useCallback(async (type: 'users' | 'tutorials'): Promise<boolean> => {
    if (!currentParams) return false;

    const pagination = type === 'users' ? results.usersPagination : results.tutorialsPagination;
    if (!pagination?.hasNext) return false;

    const nextPageParams = {
      ...currentParams,
      page: pagination.page + 1,
    };

    if (type === 'users') {
      return await searchUsersOnly(nextPageParams);
    } else {
      return await searchTutorialsOnly(nextPageParams);
    }
  }, [currentParams, results, searchUsersOnly, searchTutorialsOnly]);

  /**
   * EFFACER LES RÉSULTATS
   */
  const clearResults = useCallback(() => {
    setResults({
      users: [],
      tutorials: [],
      usersPagination: null,
      tutorialsPagination: null,
    });
    setCurrentParams(null);
    searchAllApi.reset();
    searchUsersApi.reset();
    searchTutorialsApi.reset();
  }, [searchAllApi, searchUsersApi, searchTutorialsApi]);

  return {
    results,
    status,
    error,
    isLoading,
    hasResults,
    searchBySkill,
    searchByCategory,
    searchUsersOnly,
    searchTutorialsOnly,
    loadMore,
    clearResults,
    currentParams,
  };
};

/**
 * Hook spécialisé pour la recherche avec historique
 */
export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchParams[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);

  const addToHistory = useCallback((params: SearchParams) => {
    setSearchHistory(prev => {
      // Éviter les doublons
      const filtered = prev.filter(p => 
        !(p.skillId === params.skillId && p.categoryId === params.categoryId)
      );
      const newHistory = [params, ...filtered].slice(0, 10); // Max 10 éléments
      return newHistory;
    });
    setCurrentSearchIndex(0);
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    setCurrentSearchIndex(-1);
  }, []);

  return {
    searchHistory,
    currentSearchIndex,
    addToHistory,
    clearHistory,
    hasHistory: searchHistory.length > 0,
  };
};

/**
 * Hook combiné recherche + historique
 */
export const useAdvancedSearch = () => {
  const search = useSearch();
  const history = useSearchHistory();

  // Wrapper pour ajouter à l'historique automatiquement
  const searchWithHistory = useCallback(async (
    type: 'skill' | 'category',
    id: number,
    page = 1
  ) => {
    const params = type === 'skill' 
      ? createSkillSearchParams(id, page)
      : createCategorySearchParams(id, page);

    if (page === 1) {
      history.addToHistory(params);
    }

    return type === 'skill' 
      ? await search.searchBySkill(id, page)
      : await search.searchByCategory(id, page);
  }, [search, history]);

  return {
    ...search,
    ...history,
    searchWithHistory,
  };
};