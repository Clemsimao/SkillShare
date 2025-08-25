import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosError,
  type AxiosRequestConfig,
} from "axios";
import { API_CONFIG, DEFAULT_HEADERS, HTTP_STATUS, ENV } from "./config";

// 🔐 Token utilities (sera détaillé dans token.ts)
// Import temporaire - sera remplacé par import depuis token.ts
const getStoredToken = (): string | null => {
  if (typeof globalThis.window === "undefined") return null;
  try {
    return globalThis.localStorage.getItem(API_CONFIG.TOKEN_KEY);
  } catch {
    return null;
  }
};

const removeStoredToken = (): void => {
  if (typeof globalThis.window === "undefined") return;
  try {
    globalThis.localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  } catch (error) {
    console.warn("Failed to remove token:", error);
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(globalThis.atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

//  Factory function pour créer l'instance Axios
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: DEFAULT_HEADERS,
  });

  // 📤REQUEST INTERCEPTOR - Ajoute automatiquement le JWT
  client.interceptors.request.use(
    (config) => {
      //  Auto-injection du token JWT si disponible et valide
      const token = getStoredToken();
      if (token && !isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      //  Debug en développement
      if (ENV.DEVELOPMENT) {
        console.log(` ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    },
    (error) => {
      console.error(" Request interceptor error:", error);
      return Promise.reject(error);
    }
  );

  //  RESPONSE INTERCEPTOR - Gère les erreurs automatiquement
  client.interceptors.response.use(
    //  Succès - Log en développement
    (response: AxiosResponse) => {
      if (ENV.DEVELOPMENT) {
        console.log(
          ` ${response.status} ${response.config.url}`,
          response.data
        );
      }
      return response;
    },

    //  Erreur - Gestion automatique selon le status code
    (error: AxiosError) => {
      const status = error.response?.status;
      const url = error.config?.url;

      //  401 Unauthorized - Token expiré ou invalide
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        console.warn("🔐 Token expired or invalid, redirecting to login...");
        removeStoredToken();

        // Redirection vers login (uniquement côté client)
        if (typeof globalThis.window !== "undefined") {
          // Éviter la redirection infinie si on est déjà sur la page de login
          if (!globalThis.window.location.pathname.includes("/auth/login")) {
            globalThis.window.location.replace("/auth/login");
          }
        }
      }

      //  403 Forbidden - Accès refusé (différent de 401)
      else if (status === HTTP_STATUS.FORBIDDEN) {
        console.warn(" Access forbidden for:", url);
      }

      //  404 Not Found - Ressource non trouvée
      else if (status === HTTP_STATUS.NOT_FOUND) {
        console.warn(" Resource not found:", url);
      }

      // ⚡ 409 Conflict - Conflit (ex: email déjà utilisé)
      else if (status === HTTP_STATUS.CONFLICT) {
        console.warn("⚡ Conflict detected:", url, error.response?.data);
      }

      //  500+ Server errors - Erreur serveur
      else if (status && status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
        console.error(" Server error:", status, url, error.response?.data);
      }

      //  Network errors - Pas de réponse du serveur
      else if (!status) {
        console.error(" Network error - Server unreachable:", url);
      }

      //  Log complet en développement
      if (ENV.DEVELOPMENT) {
        console.error("API Error Details:", {
          status,
          url,
          method: error.config?.method?.toUpperCase(),
          data: error.response?.data,
          message: error.message,
        });
      }

      return Promise.reject(error);
    }
  );

  return client;
};

//  Instance principale HTTP - Singleton pattern
export const httpClient = createHttpClient();

//  Types pour les méthodes HTTP
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

//  Generic request wrapper - Fonction utilitaire moderne
//  Simplifie l'utilisation d'Axios avec TypeScript strict
export const request = async <TResponse = unknown>(
  method: HttpMethod,
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<TResponse> => {
  const response: AxiosResponse<TResponse> = await httpClient.request({
    method,
    url,
    ...(data && { data }),
    ...config,
  });

  return response.data;
};

//  Méthodes de convenance - Raccourcis pour les opérations courantes
export const api = {
  //  GET - Récupération de données
  get: <TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => request<TResponse>("GET", url, undefined, config),

  // POST - Création de nouvelles ressources
  post: <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => request<TResponse>("POST", url, data, config),

  //  PUT - Mise à jour complète
  put: <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => request<TResponse>("PUT", url, data, config),

  //  PATCH - Mise à jour partielle
  patch: <TResponse = unknown>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => request<TResponse>("PATCH", url, data, config),

  //  DELETE - Suppression
  delete: <TResponse = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => request<TResponse>("DELETE", url, undefined, config),
} as const;

//  Utilities pour les cas spéciaux
export const apiUtils = {
  //  Upload de fichiers avec FormData
  uploadFile: async <TResponse = unknown>(
    url: string,
    file: File,
    fieldName = "file",
    additionalData?: Record<string, string>
  ): Promise<TResponse> => {
    const formData = new FormData();
    formData.append(fieldName, file);

    // Ajouter des données supplémentaires si nécessaires
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return request<TResponse>("POST", url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      timeout: API_CONFIG.TIMEOUT * 3, // Plus de temps pour les uploads
    });
  },

  //  Retry automatique pour les requêtes importantes
  requestWithRetry: async <TResponse = unknown>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    maxRetries = API_CONFIG.RETRY_ATTEMPTS
  ): Promise<TResponse> => {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await request<TResponse>(method, url, data);
      } catch (error) {
        lastError = error as Error;

        // Ne pas retry sur certaines erreurs (401, 403, 404, etc.)
        if (error instanceof Error && "response" in error) {
          const axiosError = error as AxiosError;
          const status = axiosError.response?.status;

          if (
            status &&
            [
              HTTP_STATUS.UNAUTHORIZED,
              HTTP_STATUS.FORBIDDEN,
              HTTP_STATUS.NOT_FOUND,
              HTTP_STATUS.CONFLICT,
            ].includes(status)
          ) {
            throw error;
          }
        }

        // Délai exponentiel entre les tentatives
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt - 1) * 1000; // 1s, 2s, 4s...
          await new Promise((resolve) => setTimeout(resolve, delay));
          console.warn(`🔄 Retry attempt ${attempt}/${maxRetries} for ${url}`);
        }
      }
    }

    throw lastError!;
  },
} as const;

//  Helper pour les tests - Mock des requêtes
export const createMockClient = () => {
  if (!ENV.TEST) {
    throw new Error("Mock client can only be used in test environment");
  }

  // Configuration pour les tests unitaires
  return axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 1000,
  });
};

//  Export des types pour usage externe
export type { AxiosResponse, AxiosError, AxiosRequestConfig };
