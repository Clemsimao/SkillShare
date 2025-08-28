
// Services de gestion des profils utilisateurs et compétences

import { api, uploadFile } from "../lib/http-client";
import { ENDPOINTS, buildUrl } from "../lib/config";
import type {
  User,
  UpdateUserData,
  AddSkillRequest,
  ApiResponse,
} from "../types/api";

/**
 * PROFIL PUBLIC - Récupérer le profil d'un utilisateur par son ID
 */
export const getUserProfile = async (
  userId: number
): Promise<{ success: boolean; message: string; user: User }> => {
  const {data} = await api.get<{ success: boolean; message: string; user: User }>(
    buildUrl.userProfile(userId)
  );
  return data;
};

/**
 * MISE À JOUR PROFIL - Modifier son profil personnel
 */
export const updateProfile = async (
  userData: UpdateUserData
): Promise<{ success: boolean; message: string; user: User }> => {
  const {data} = await api.put<{ success: boolean; message: string; user: User }>(
  ENDPOINTS.USERS.UPDATE_PROFILE,
  userData
);
  return data;
};

/**
 * UPLOAD PHOTO - Mettre à jour la photo de profil
 */
export const uploadProfilePicture = async (
  imageFile: File
): Promise<{ success: boolean; message: string; url: string }> => {
  const formData = new FormData();
  formData.append("avatar", imageFile);
  
  const data = await uploadFile<{ success: boolean; message: string; url: string }>(
    ENDPOINTS.USERS.UPLOAD_PICTURE,
    formData
  );
  return data;
};

/**
 * SUPPRESSION COMPTE - Supprimer définitivement son compte
 */
export const deleteAccount = async (): Promise<ApiResponse> => {
  const {data} = await api.delete<ApiResponse>(ENDPOINTS.USERS.DELETE_PROFILE);
  return data;
};

/**
 * AJOUTER COMPÉTENCE - Ajouter une compétence à son profil
 */
export const addUserSkill = async (
  skillId: number
): Promise<{
  success: boolean;
  message: string;
  skill: { id: number; title: string };
}> => {
  const skillData: AddSkillRequest = { skillId };
  const {data} = await api.post<{
    success: boolean;
    message: string;
    skill: { id: number; title: string };
  }>(ENDPOINTS.USERS.ADD_SKILL, skillData);
  return data;
};

/**
 * RETIRER COMPÉTENCE - Supprimer une compétence de son profil
 */
export const removeUserSkill = async (
  skillId: number
): Promise<ApiResponse> => {
  const {data} = await api.delete<ApiResponse>(buildUrl.removeUserSkill(skillId));
  return data;
};

/**
 * AJOUTER INTÉRÊT - Ajouter un intérêt à son profil
 */
export const addUserInterest = async (
  skillId: number
): Promise<{
  success: boolean;
  message: string;
  interest: { id: number; title: string };
}> => {
  const skillData: AddSkillRequest = { skillId };
  const {data} = await api.post<{
    success: boolean;
    message: string;
    interest: { id: number; title: string };
  }>(ENDPOINTS.USERS.ADD_INTEREST, skillData);
  return data;
};

/**
 * RETIRER INTÉRÊT - Supprimer un intérêt de son profil
 */
export const removeUserInterest = async (
  skillId: number
): Promise<ApiResponse> => {
  const {data} = await api.delete<ApiResponse>(buildUrl.removeUserInterest(skillId));
  return data;
};
