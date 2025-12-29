
import express from "express";
import upload from "../config/multer.js";
import { Tutorial } from "../models/index.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  getLandingTutorial,
  getLatestTutorials,
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

//Récupère les 3 derniers tutoriels
router.get("/latest", getLatestTutorials);

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
import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

// Route POST /tutorials/:id/image
router.post('/:id/image', uploadImageTutorial.single('image'), async (req, res) => {
  console.log('Route image appelée (Manual Upload)', req.params.id);

  try {
    const tutorialId = req.params.id;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Aucun fichier fourni" });
    }

    // Fonction de promesse pour l'upload stream
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: 'skillshare/tutorials',
            resource_type: 'image',
            transformation: [{ width: 1600, height: 1600, crop: 'limit' }]
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        Readable.from(fileBuffer).pipe(stream);
      });
    };

    // Exécution de l'upload
    const result = await streamUpload(req.file.buffer);
    const imageUrl = result.secure_url;

    console.log("Upload succes:", imageUrl);

    // Met à jour le tutoriel avec l’URL de l’image
    await Tutorial.update(
      { picture: imageUrl },
      { where: { tutorial_id: tutorialId } }
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    console.error("Erreur echec upload manual:", error);
    res.status(500).json({ success: false, message: "Erreur upload image: " + error.message });
  }
});

export default router;
