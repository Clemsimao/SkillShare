// Le fichier token.ts est le gestionnaire central des tokens JWT côté front-end.
// Son rôle est de stocker, récupérer et supprimer le token JWT que le backend envoie après une authentification réussie.

// Import de la configuration API pour récupérer la clé de stockage du token
import { API_CONFIG } from "./config";

/**
 * Stocke le token JWT dans le localStorage. Rappel localStorage : c'est un espace de stockage intégré dans le navigateur.
 //* @param token - Le token JWT reçu après login ou création de profil
 */

/*------------------------------enregistrer le token JWT-----------------------------------------------------
storeToken sert à enregistrer le token JWT (que le backend renvoie après un login ou un register) dans le navigateur via localStorage.
C’est ce qui permet :
de rester connecté même après un rafraîchissement de page,
d’envoyer automatiquement le token dans les futures requêtes via http-client.ts.
*/
export const storeToken = (token: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(API_CONFIG.TOKEN_KEY, token);
  }
};

/**----------------------------récupérer le token-------------------------------------------------------------
 * Récupère le token JWT depuis le localStorage
 * @returns Le token JWT ou null si inexistant
 */
/*
But de getToken : récupérer le token stocké dans le navigateur.
Utilisation : utilisé par http-client.ts pour ajouter automatiquement le token dans l'entête Authorization lors des appels API.
*/

export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(API_CONFIG.TOKEN_KEY);
  }
  return null;
};

/*------------------------------supprimer le token------------------------------------------------------------
But de removeToken : supprimer le token du navigateur.
Utilisation : quand l’utilisateur clique sur "Déconnexion"
              quand le token est expiré ou invalide (détecté par http-client.ts)
*/
export const removeToken = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(API_CONFIG.TOKEN_KEY);
  }
};
