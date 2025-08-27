// hooks/use-api.ts
// Hook générique pour appels API avec état de chargement

import { useState, useCallback, useRef } from "react";
import type { ApiStatusType } from "../types/api";

interface UseApiReturn<T> {
  data: T | null;
  status: ApiStatusType;
  error: string | null;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Hook générique pour les appels API
 * Gère l'état de chargement, les données et les erreurs
 */
export const useApi = <T>(
  apiFunction: (...args: unknown[]) => Promise<T>
): UseApiReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<ApiStatusType>("idle");
  const [error, setError] = useState<string | null>(null);

  // Référence pour éviter les appels multiples
  const isExecutingRef = useRef(false);

  // États dérivés
  const isLoading = status === "loading";
  const isSuccess = status === "success";
  const isError = status === "error";

  /**
   * EXÉCUTION - Déclencher l'appel API
   */
  const execute = useCallback(
    async (...args: unknown[]): Promise<T | null> => {
      // Éviter les appels multiples simultanés
      if (isExecutingRef.current) {
        return null;
      }

      try {
        isExecutingRef.current = true;
        setStatus("loading");
        setError(null);

        const result = await apiFunction(...args);

        setData(result);
        setStatus("success");
        return result;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";

        setError(errorMessage);
        setStatus("error");
        return null;
      } finally {
        isExecutingRef.current = false;
      }
    },
    [apiFunction]
  );

  /**
   * REMISE À ZÉRO - Réinitialiser l'état
   */
  const reset = useCallback(() => {
    setData(null);
    setStatus("idle");
    setError(null);
    isExecutingRef.current = false;
  }, []);

  return {
    data,
    status,
    error,
    isLoading,
    isSuccess,
    isError,
    execute,
    reset,
  };
};
