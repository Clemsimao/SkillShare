import express from 'express';
import { getAllSkills, getAllCategories } from '../controllers/skillController.js';

const router = express.Router();

// ROUTES PUBLIQUES - Données de référence

/**
 * GET /api/skills
 * Récupérer toutes les compétences disponibles avec leurs catégories
 * Public - pas d'authentification requise
 * Utilisé par le frontend pour les formulaires/dropdowns
 */
router.get('/', getAllSkills);

/**
 * GET /api/categories
 * Récupérer toutes les catégories disponibles
 * Public - pas d'authentification requise
 * Utilisé par le frontend pour les filtres/organisation
 */
router.get('/categories', getAllCategories);

export default router;