import { Tutorial, User } from "../models/index.js";
import { Op } from "sequelize";

export const tutorialService = {
  /**
   * Récupère tous les tutoriels publiés
   * @returns {Array} Liste des tutoriels
   */
  async getAllTutorials() {
    try {
      const tutorials = await Tutorial.findAll({
        where: { published_at: { [Op.ne]: null } }, // seulement les publiés
        include: [
          {
            association: "author",
            attributes: ["user_id", "username", "profile_picture"],
          },
        ],
        order: [["created_at", "DESC"]], // Ajout du tri du plus récent au plus ancien
      });

      return tutorials.map((tutorial) => ({
        id: tutorial.tutorial_id,
        title: tutorial.title,
        content: tutorial.content,
        picture: tutorial.picture,
        videoLink: tutorial.video_link,
        author: {
          id: tutorial.author.user_id,
          username: tutorial.author.username,
          profilePicture: tutorial.author.profile_picture,
        },
        createdAt: tutorial.created_at,
        updatedAt: tutorial.updated_at,
        publishedAt: tutorial.published_at,
      }));
    } catch (error) {
      console.error("❌ Erreur getAllTutorials:", error);
      throw new Error("Erreur lors de la récupération des tutoriels");
    }
  },

  /**
   * Récupère un tutoriel par son ID
   * @param {number} id - ID du tutoriel
   * @returns {Object|null} Tutoriel trouvé ou null
   */

  async getTutorialById(id) {
    try {
      const tutorial = await Tutorial.findOne({
        where: { tutorial_id: id },
        include: [
          {
            association: "author",
            attributes: ["user_id", "username", "profile_picture"],
          },
        ],
      });

      if (!tutorial) return null; // Retourne null si aucun tutoriel ne correspond à l’ID.

      return {
        id: tutorial.tutorial_id,
        title: tutorial.title,
        content: tutorial.content,
        picture: tutorial.picture,
        videoLink: tutorial.video_link,
        author: {
          id: tutorial.author.user_id,
          username: tutorial.author.username,
          profilePicture: tutorial.author.profile_picture,
        },
        createdAt: tutorial.created_at,
        updatedAt: tutorial.updated_at,
        publishedAt: tutorial.published_at,
      };
    } catch (error) {
      console.error("❌ Erreur getTutorialById:", error);
      throw new Error("Erreur lors de la récupération du tutoriel");
    }
  },

  async createTutorial(data) {
    try {
      const newTutorial = await Tutorial.create({
        title: data.title,
        content: data.content,
        picture: data.picture || null,
        video_link: data.video_link || null,
        user_id: data.user_id,
        published_at: new Date(), // pas de brouillon pour le MVP, donc publié directement
      });
      return newTutorial;
    } catch (error) {
      console.error("Erreur création tutoriel :", error.message);
      return null;
    }
  },

  async updateTutorial(id, data) {
    try {
      const tutorial = await Tutorial.findByPk(id);
      if (!tutorial) return null;

      await tutorial.update({
        title: data.title,
        content: data.content || null,
        picture: data.picture || null,
        video_link: data.video_link || null,
        updated_at: new Date(),
      });

      return tutorial;
    } catch (error) {
      console.error("Erreur updateTutorial :", error.message);
      return null;
    }
  },

  async deleteTutorial(id) {
    try {
      const tutorial = await Tutorial.findByPk(id);
      if (!tutorial) return null;

      await tutorial.destroy();
      return tutorial;
    } catch (error) {
      console.error("Erreur deleteTutorial :", error.message);
      return null;
    }
  },
};
