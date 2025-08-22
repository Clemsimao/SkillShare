
import express from "express";
import upload from "../config/multer.js";
import { Tutorial } from "../models/index.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getLandingTutorial,
  getAllTutorials,
  getTutorialById,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} from "../controllers/tutorialController.js";

import { uploadImageTutorial } from '../config/multer.js';

const router = express.Router();

// =====================================================
// ROUTES PUBLIQUES - Pas d'authentification requise
// =====================================================

//Récupère le dernier tutoriel pour la landing page
router.get("/landing", getLandingTutorial);

// =====================================================
// ROUTES PROTÉGÉES - Authentification requise
// =====================================================

//Récupère tous les tutoriels
router.get("/", authMiddleware, getAllTutorials);

//Récupère un tutoriel par ID
router.get("/:id", authMiddleware, getTutorialById);

// Cree un nouveau tutoriel
router.post("/", authMiddleware, createTutorial);

//Mettre a jour un tutoriel
router.put("/:id", authMiddleware, updateTutorial);

// Supprimer un tutoriel
router.delete("/:id", authMiddleware, deleteTutorial);

// Route POST /tutorials/:id/image
router.post('/:id/image', uploadImageTutorial.single('image'), async (req, res) => {
    console.log('Route image appelée', req.params.id, req.file);

  try {
    const tutorialId = req.params.id;
    const imageUrl = req.file.path; // URL Cloudinary

    // Met à jour le tutoriel avec l’URL de l’image
    await Tutorial.update(
      { image_url: imageUrl },
      { where: { tutorial_id: tutorialId } }
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erreur upload image" });
  }
});

export default router;
