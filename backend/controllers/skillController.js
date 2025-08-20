import { skillService } from '../services/skillService.js';

/**
 * Récupérer toutes les compétences disponibles
 * GET /api/skills
 * Route publique
 */
export const getAllSkills = async (req, res) => {
  try {
    const skills = await skillService.getAllSkills();

    res.status(200).json({
      success: true,
      message: 'Compétences récupérées avec succès',
      skills,
      count: skills.length
    });

  } catch (error) {
    console.error('❌ Erreur getAllSkills:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des compétences'
    });
  }
};

/**
 * Récupérer toutes les catégories disponibles
 * GET /api/categories
 * Route publique
 */
export const getAllCategories = async (req, res) => {
  try {
    const categories = await skillService.getAllCategories();

    res.status(200).json({
      success: true,
      message: 'Catégories récupérées avec succès',
      categories,
      count: categories.length
    });

  } catch (error) {
    console.error('❌ Erreur getAllCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des catégories'
    });
  }
};