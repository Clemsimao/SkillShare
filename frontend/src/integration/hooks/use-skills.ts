// hooks/use-skills.ts
// Hook pour la gestion des compétences et catégories

import { useState, useEffect, useCallback } from "react";
import { getSkills, getCategories } from "../services/public";
import {
  addUserSkill,
  removeUserSkill,
  addUserInterest,
  removeUserInterest,
} from "../services/user";
import { useApi } from "./use-api";
import type { Skill, Category, ApiStatusType } from "../types/api";

interface UseSkillsReturn {
  // Données
  skills: Skill[];
  categories: Category[];

  // États de chargement
  skillsStatus: ApiStatusType;
  categoriesStatus: ApiStatusType;
  isLoading: boolean;

  // Actions
  loadSkills: () => Promise<void>;
  loadCategories: () => Promise<void>;
  addSkillToUser: (skillId: number) => Promise<boolean>;
  removeSkillFromUser: (skillId: number) => Promise<boolean>;
  addInterestToUser: (skillId: number) => Promise<boolean>;
  removeInterestFromUser: (skillId: number) => Promise<boolean>;

  // Helpers
  getSkillsByCategory: (categoryId: number) => Skill[];
  findSkillById: (skillId: number) => Skill | undefined;
}

/**
 * Hook pour la gestion des compétences et catégories
 * Charge les données publiques et gère les actions utilisateur
 */
export const useSkills = (): UseSkillsReturn => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [skillsStatus, setSkillsStatus] = useState<ApiStatusType>("idle");
  const [categoriesStatus, setCategoriesStatus] =
    useState<ApiStatusType>("idle");

  // Hooks pour les actions utilisateur
  const addSkillApi = useApi(addUserSkill);
  const removeSkillApi = useApi(removeUserSkill);
  const addInterestApi = useApi(addUserInterest);
  const removeInterestApi = useApi(removeUserInterest);

  const isLoading =
    skillsStatus === "loading" || categoriesStatus === "loading";

  /**
   * CHARGEMENT COMPÉTENCES - Récupérer toutes les compétences
   */
  const loadSkills = useCallback(async () => {
    try {
      setSkillsStatus("loading");
      const response = await getSkills();
      setSkills(response.skills);
      setSkillsStatus("success");
    } catch (error) {
      console.error("Erreur chargement compétences:", error);
      setSkillsStatus("error");
    }
  }, []);

  /**
   * CHARGEMENT CATÉGORIES - Récupérer toutes les catégories
   */
  const loadCategories = useCallback(async () => {
    try {
      setCategoriesStatus("loading");
      const response = await getCategories();
      setCategories(response.categories);
      setCategoriesStatus("success");
    } catch (error) {
      console.error("Erreur chargement catégories:", error);
      setCategoriesStatus("error");
    }
  }, []);

  /**
   * Chargement automatique au montage
   */
  useEffect(() => {
    loadSkills();
    loadCategories();
  }, [loadSkills, loadCategories]);

  /**
   * AJOUTER COMPÉTENCE UTILISATEUR
   */
  const addSkillToUser = useCallback(
    async (skillId: number): Promise<boolean> => {
      const result = await addSkillApi.execute(skillId);
      return result !== null;
    },
    [addSkillApi]
  );

  /**
   * RETIRER COMPÉTENCE UTILISATEUR
   */
  const removeSkillFromUser = useCallback(
    async (skillId: number): Promise<boolean> => {
      const result = await removeSkillApi.execute(skillId);
      return result !== null;
    },
    [removeSkillApi]
  );

  /**
   * AJOUTER INTÉRÊT UTILISATEUR
   */
  const addInterestToUser = useCallback(
    async (skillId: number): Promise<boolean> => {
      const result = await addInterestApi.execute(skillId);
      return result !== null;
    },
    [addInterestApi]
  );

  /**
   * RETIRER INTÉRÊT UTILISATEUR
   */
  const removeInterestFromUser = useCallback(
    async (skillId: number): Promise<boolean> => {
      const result = await removeInterestApi.execute(skillId);
      return result !== null;
    },
    [removeInterestApi]
  );

  /**
   * HELPER - Filtrer les compétences par catégorie
   */
  const getSkillsByCategory = useCallback(
    (categoryId: number): Skill[] => {
      return skills.filter((skill) => {
        if (typeof skill.category === "object") {
          return skill.category.id === categoryId;
        }
        return false;
      });
    },
    [skills]
  );

  /**
   * HELPER - Trouver une compétence par son ID
   */
  const findSkillById = useCallback(
    (skillId: number): Skill | undefined => {
      return skills.find((skill) => skill.id === skillId);
    },
    [skills]
  );

  return {
    skills,
    categories,
    skillsStatus,
    categoriesStatus,
    isLoading,
    loadSkills,
    loadCategories,
    addSkillToUser,
    removeSkillFromUser,
    addInterestToUser,
    removeInterestFromUser,
    getSkillsByCategory,
    findSkillById,
  };
};

/**
 * Hook simplifié pour charger seulement les compétences d'une catégorie
 */
export const useSkillsByCategory = (categoryId: number | null) => {
  const { skills, skillsStatus, getSkillsByCategory } = useSkills();

  const categorySkills = categoryId ? getSkillsByCategory(categoryId) : [];

  return {
    skills: categorySkills,
    status: skillsStatus,
    isLoading: skillsStatus === "loading",
    isEmpty: categorySkills.length === 0 && skillsStatus === "success",
  };
};
