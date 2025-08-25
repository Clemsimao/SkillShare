import { tutorialService } from "../services/tutorialService.js";
import { userService } from "../services/userService.js";

// -------------------------------
// Partie publique : Pour landing page, pas besoin de JWT
// -------------------------------

//liste limitée de tutoriels visibles sur la page d’accueil
export const getLandingTutorial = async (req, res) => {
  try {
    //reutiliser le service existant
    const tutorials = await tutorialService.getAllTutorials();

    const landingTutorial = tutorials[0] || null;

    return res.status(200).json({
      success: true,
      message: "Tutoriel landing page récupéré",
      tutorial: landingTutorial,
    });
  } catch (error) {
    console.error("❌ Erreur getLandingTutorial controller:", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les tutoriels",
    });
  }
};

// -------------------------------
// Partie privée : Avec JWT
// -------------------------------

export const getAllTutorials = async (req, res) => {
  try {
    const tutorials = await tutorialService.getAllTutorials();
    return res.status(200).json({
      success: true,
      message: "Tutoriels récupérés avec succès",
      tutorials: tutorials,
    });
  } catch (error) {
    console.error("❌ Erreur getAllTutorial controller:", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer les tutoriels.",
    });
  }
};

export const getTutorialById = async (req, res) => {
  try {
    const { id } = req.params;

    //Validation ID
    if (!id || Number.isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "ID tutorial invalide",
      });
    }

    const tutorial = await tutorialService.getTutorialById(Number.parseInt(id));

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutoriel non trouvé",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tutoriel recupere avec succes",
      tutorial,
    });
  } catch (error) {
    console.error("❌ Erreur getTutorialById controller:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération du tutoriel",
    });
  }
};

// Création d'un tutoriel

export const createTutorial = async (req, res) => {
  try {
    const userId = req.user.id; // Ici on récupère l'ID depuis le token JWT
    const { title, content, picture, video_link } = req.body;

    // Vériffication des champs obligatoires

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Le titre est obligatoire pour créer un tutoriel",
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Vous devez ajouter un contenu pour créer un tutoriel",
      });
    }

    // Préparer les données pour le service
    const tutorialData = {
      user_id: userId,
      title,
      content,
      picture,
      video_link,
    };

    // Création du tutoriel
    const tutorial = await tutorialService.createTutorial(tutorialData);

    if (!tutorial) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la création du tutoriel",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Tutoriel crée avec succès.",
      tutorial,
    });
  } catch (error) {
    console.error("❌ Erreur createTutorial controller:", error);

    return res.status(500).json({
      success: false,
      message:
        "Impossible de créer le tutoriel pour le moment, veuillez réessayer plus tard",
    });
  }
};

// Mettre à jour un tutoriel

export const updateTutorial = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // vient du middleware auth
    const { title, content, picture, video_link } = req.body;

    //validation ID
    if (!id || Number.isNaN(Number.parseInt(id))) {
      return res.status(400).json({
        success: false,
        message: "ID tutorial invalide",
      });
    }

    // Vérifier que le tutoriel existe et appartient à l'utilisateur
    const existingTutorial = await tutorialService.getTutorialById(
      Number.parseInt(id)
    );
    if (!existingTutorial) {
      return res.status(404).json({
        success: false,
        message: "Tutoriel non trouvé",
      });
    }

    if (existingTutorial.author.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Vous ne pouvez modifier que vos propres tutoriels",
      });
    }

    // validation donnees (au moins un champs à modifier)
    if (!title && !content && !picture && !video_link) {
      return res.status(400).json({
        success: false,
        message: "Au moins un champ doit être fourni pour la mise à jour",
      });
    }

    // Appel service
    const updatedTutorial = await tutorialService.updateTutorial(
      Number.parseInt(id),
      {
        title,
        content,
        picture,
        video_link,
      }
    );

    if (!updatedTutorial) {
      return res.status(500).json({
        success: false,
        message: "Erreur lors de la mise à jour du tutoriel",
      });
    }

    res.status(200).json({
      success: true,
      message: "Tutoriel mis à jour avec succès",
      tutorial: updatedTutorial,
    });
  } catch (error) {
    console.error("❌ Erreur updateTutorial controller:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la mise à jour du tutoriel",
    });
  }
};

// Supprimer un tutoriel

export const deleteTutorial = async (req, res) => {
  try {
    const tutorialId = req.params.id; // ID de l'URL
    const userId = req.user.id; // ID de l'utilisateur connecté (provenant du JWT)

    const deleted = await tutorialService.deleteTutorial(tutorialId, userId);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Vous n'êtes pas autorisé à supprimer le tutoriel.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tutoriel supprimé avec succès.",
    });
  } catch (error) {
    console.error("❌ Erreur de deleteTutorial controller:", error);

    return res.status(500).json({
      success: false,
      message:
        "Impossible de supprimer le tutoriel pour le moment. Veuillez réessayer plus tard.",
    });
  }
};
