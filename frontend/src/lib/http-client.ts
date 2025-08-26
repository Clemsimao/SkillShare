import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_CONFIG } from './config';

// GESTION DU TOKEN JWT
// Ces fonctions gèrent le stockage du token d'authentification
const getStoredToken = (): string | null => {
  // Vérification côté serveur - localStorage n'existe pas sur le serveur
  if (typeof window === 'undefined') return null;
  // Récupère le token depuis le localStorage du navigateur
  return localStorage.getItem(API_CONFIG.TOKEN_KEY);
};

const removeStoredToken = (): void => {
  if (typeof window === 'undefined') return;
  // Supprime le token du localStorage (lors de la déconnexion)
  localStorage.removeItem(API_CONFIG.TOKEN_KEY);
};

const isTokenExpired = (token: string): boolean => {
  try {
    // Décode la partie payload du JWT (format: header.payload.signature)
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Compare la date d'expiration (exp) avec l'heure actuelle
    return payload.exp * 1000 < Date.now(); // exp est en secondes, Date.now() en millisecondes
  } catch {
    // Si décodage échoue, considère le token comme expiré
    return true;
  }
};

// CRÉATION DE L'INSTANCE AXIOS
const createHttpClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: API_CONFIG.BASE_URL,     // URL de base (http://localhost:8000)
    timeout: API_CONFIG.TIMEOUT,      // Timeout de 10 secondes
    headers: {
      'Content-Type': 'application/json', // Toutes les requêtes en JSON
    },
  });

  // INTERCEPTEUR DE REQUÊTE - Ajoute automatiquement le JWT
  client.interceptors.request.use((config) => {
    const token = getStoredToken();
    // Si token existe ET n'est pas expiré, l'ajouter aux headers
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // Continuer avec la requête modifiée
  });

  // INTERCEPTEUR DE RÉPONSE - Gère les erreurs automatiquement
  client.interceptors.response.use(
    (response) => response, // Si succès, passer la réponse telle quelle
    (error: AxiosError) => {
      // Si erreur 401 (Unauthorized) = token expiré/invalide
      if (error.response?.status === 401) {
        removeStoredToken();           // Supprimer le token invalide
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/login'; // Rediriger vers login
        }
      }
      return Promise.reject(error);    // Propager l'erreur pour gestion locale
    }
  );

  return client;
};

// INSTANCE PRINCIPALE - Créée une seule fois (singleton pattern)
export const httpClient = createHttpClient();

// FONCTION UTILITAIRE - Simplifie l'utilisation d'Axios
export const request = async <T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE', // Méthodes HTTP supportées
  url: string,                               // URL de l'endpoint
  data?: unknown                            // Données à envoyer (pour POST/PUT)
): Promise<T> => {
  // Fait la requête avec httpClient (qui a déjà les intercepteurs)
  const response = await httpClient.request({
    method,
    url,
    data, // Axios ignore automatiquement 'data' pour GET/DELETE
  });
  
  return response.data; // Retourne seulement les données (pas les headers, status, etc.)
};