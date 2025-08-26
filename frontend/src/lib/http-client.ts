import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import { API_CONFIG, DEFAULT_HEADERS } from "./config";
import { getToken, removeToken } from "./token";

// Vérifie si le token est expiré
const isTokenExpired = (token: string) => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Création d'une instance Axios
const httpClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Ajout automatique du token aux requêtes
httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gestion simple des réponses / erreurs
httpClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken(); // Supprime le token si expiré ou invalide
      if (typeof window !== "undefined") window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

// Wrapper générique pour les requêtes
export const request = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await httpClient.request<T>({
    method,
    url,
    data,
    ...config,
  });
  return response.data;
};

// Méthodes simplifiées
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>("GET", url, undefined, config),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("POST", url, data, config),
  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>("PUT", url, data, config),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>("DELETE", url, undefined, config),
};

export { httpClient };
