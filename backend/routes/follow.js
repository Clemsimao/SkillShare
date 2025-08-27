import express from "express";

import { UserFollow } from "../models/UserFollow.js";
import { authMiddleware } from "../middlewares/auth.js";
import {
  toggleFollow,
  getFollowers,
  getFollowing,
} from "../controllers/followController.js";

const router = express.Router();

// =====================================================
// ROUTES PROTÉGÉES - Avec authentification requise
// =====================================================

// S'abonner ou se désabonner d'un utilisateur

router.post("/:id", authMiddleware, toggleFollow); // id pour le toggle abonnement/désabonnement.

// Récupérer la liste des utilisateurs que je suis (following)

router.get("/following", authMiddleware, getFollowing);

// Récupérer la liste de mes abonnés (followers)
router.get("/followers", authMiddleware, getFollowers);

export default router;
