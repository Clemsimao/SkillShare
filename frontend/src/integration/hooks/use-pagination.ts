// Hook générique pour la gestion de la pagination

import { useState, useCallback, useMemo } from "react";
import type { Pagination as PaginationData } from "../types/api";

interface UsePaginationReturn {
  // État de pagination
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isFirstPage: boolean;
  isLastPage: boolean;

  // Actions
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  reset: () => void;

  // Helpers
  getPageNumbers: (maxVisible?: number) => number[];
  setPaginationData: (data: PaginationData) => void;
}

/**
 * Hook générique pour la pagination
 * Réutilisable pour tous les composants avec pagination
 */
export const usePagination = (initialPage = 1): UsePaginationReturn => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNext, setHasNext] = useState(false);

  // États dérivés
  const hasPrevious = currentPage > 1;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  /**
   * ALLER À UNE PAGE SPÉCIFIQUE
   */
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  }, [totalPages]);

  /**
   * PAGE SUIVANTE
   */
  const nextPage = useCallback(() => {
    if (hasNext) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNext]);

  /**
   * PAGE PRÉCÉDENTE
   */
  const previousPage = useCallback(() => {
    if (hasPrevious) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevious]);

  /**
   * PREMIÈRE PAGE
   */
  const goToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  /**
   * DERNIÈRE PAGE
   */
  const goToLastPage = useCallback(() => {
    setCurrentPage(totalPages);
  }, [totalPages]);

  /**
   * RESET DE LA PAGINATION
   */
  const reset = useCallback(() => {
    setCurrentPage(1);
    setTotalPages(0);
    setTotalCount(0);
    setHasNext(false);
  }, []);

  /**
   * METTRE À JOUR LES DONNÉES DE PAGINATION
   */
  const setPaginationData = useCallback((data: PaginationData) => {
    setCurrentPage(data.page);
    setTotalPages(data.totalPages);
    setTotalCount(data.totalCount);
    setHasNext(data.hasNext);
  }, []);

  /**
   * HELPER - Obtenir les numéros de pages à afficher
   */
  const getPageNumbers = useCallback((maxVisible = 5): number[] => {
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisible / 2);
    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Ajuster le début si on est proche de la fin
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    totalCount,
    hasNext,
    hasPrevious,
    isFirstPage,
    isLastPage,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    reset,
    getPageNumbers,
    setPaginationData,
  };
};

/**
 * Hook pour pagination infinie (load more)
 */
export const useInfiniteScroll = () => {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(async (
    loadFunction: (page: number) => Promise<{ items: any[]; hasMore: boolean }>
  ) => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const result = await loadFunction(page);
      setItems(prev => [...prev, ...result.items]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Erreur chargement pagination infinie:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  const reset = useCallback(() => {
    setItems([]);
    setIsLoading(false);
    setHasMore(true);
    setPage(1);
  }, []);

  return {
    items,
    isLoading,
    hasMore,
    loadMore,
    reset,
    isEmpty: items.length === 0,
  };
};

/**
 * Hook combiné pagination + filtres
 */
export const usePaginatedList = <T>(
  fetchFunction: (page: number, filters: Record<string, any>) => Promise<{
    items: T[];
    pagination: PaginationData;
  }>
) => {
  const pagination = usePagination();
  const [items, setItems] = useState<T[]>([]);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async (page: number, newFilters?: Record<string, any>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const currentFilters = newFilters || filters;
      const result = await fetchFunction(page, currentFilters);
      
      setItems(result.items);
      pagination.setPaginationData(result.pagination);
      
      if (newFilters) {
        setFilters(newFilters);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erreur de chargement";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, filters, pagination]);

  // Chargement avec nouveaux filtres (retour page 1)
  const applyFilters = useCallback((newFilters: Record<string, any>) => {
    return loadPage(1, newFilters);
  }, [loadPage]);

  // Chargement page spécifique avec filtres actuels
  const goToPage = useCallback((page: number) => {
    pagination.goToPage(page);
    return loadPage(page);
  }, [loadPage, pagination]);

  const reset = useCallback(() => {
    setItems([]);
    setFilters({});
    setError(null);
    pagination.reset();
  }, [pagination]);

  return {
    items,
    filters,
    isLoading,
    error,
    ...pagination,
    loadPage,
    applyFilters,
    goToPage,
    reset,
    isEmpty: items.length === 0 && !isLoading,
  };
};