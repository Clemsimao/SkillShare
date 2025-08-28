// lib/http-client.ts
// Client HTTP centralisé avec intercepteurs JWT automatiques

import axios from "axios";
import { API_CONFIG, DEFAULT_HEADERS } from "./config";
import { getToken, removeToken } from "./token";

// Vérifie si le token JWT est expiré
const isTokenExpired = (token: string): boolean => {
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

// Création d'une instance Axios configurée
const httpClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: DEFAULT_HEADERS,
});

// Intercepteur REQUEST : Ajoute automatiquement le token aux requêtes
httpClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token && !isTokenExpired(token)) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// Intercepteur RESPONSE : Gère les erreurs et redirections
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Upload de fichiers avec FormData
const uploadFile = async <T>(
  url: string,
  formData: FormData
): Promise<T> => {
  const response = await httpClient.post<T>(url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};


export {
  httpClient as api,
  uploadFile
}