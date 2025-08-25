import { User, UserFollow } from "../models/index.js";

export const followService = {
  /**
   * ---------------Suivre un utilisateur--------------------
   * @param {number} followerId - Id de l'utilisateur qui suit
   * @param {number} followedId - Id de l'utilisateur à suivre
   * @returns {{ isFollowing: boolean, action: "followed"|"unfollowed", message: string }}
   */

  async toggleFollow(followerId, followedId) {
    try {
      if (followerId === followedId) {
        throw new Error(
          "Impossible de s'abonner à soi même"
        );
      }

      // Vérification si le suivi existe déjà
      const existingFollow = await UserFollow.findOne({
        where: { follower_id: followerId, followed_id: followedId },
      });

      if (!existingFollow) {
        // Si la relation n'existe pas, toggle est cliqué on crée la relation
        await UserFollow.create({
          follower_id: followerId,
          followed_id: followedId,
        });

        return {
          isFollowing: true,
          action: "followed",
          message: "Utilisateur suivi avec succès.",
        };
      }

      // Si la relation existe, toggle est cliqué à nouveau, on supprime la relation
      await existingFollow.destroy();

      return {
        isFollowing: false,
        action: "unfollowed",
        message: "L'utilisateur n'est plus suivi.",
      };
    } catch (error) {
      console.error("Erreur sur toggleFollow :", error);
      throw new Error("Impossible de suivre cet utilisateur");
    }
  },

  /**
   * Récupère la liste des utilisateurs suivis par un user
   * @param {number} userId - ID de l'utilisateur
   * @returns {Array} Liste des utilisateurs suivis
   */

  // Les utilisateurs suivis
  async getFollowing(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: {
          association: "following", // Association de l'index models
          attributes: ["user_id", "username", "profile_picture"],
        },
      });

      // on vérifie que l’utilisateur existe et qu’il a bien une liste de personnes qui le suivent (followers).
      // Si l'utilisateur n'existe pas, ou pas de suivis on renvoie une liste vide
      if (!user || !user.following) return [];

      return user.following.map((followedUser) => {
        return {
          id: followedUser.user_id,
          username: followedUser.username,
          profilePicture: followedUser.profile_picture,
        };
      });
    } catch (error) {
      console.error("❌ Erreur de getFollowing:", error);
      throw new Error(
        "Impossible de récupérer la liste des utilisateurs suivis."
      );
    }
  },

  // Les utilisateurs qui suivent

  async getFollowers(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: {
          association: "followers", // Association de l'index models
          attributes: ["user_id", "username", "profile_picture"],
        },
      });

      // on vérifie que l’utilisateur existe et qu’il a bien une liste de personnes qui le suivent (followers).
      // Si l'utilisateur n'existe pas, ou pas de suiveurs on renvoie une liste vide
      if (!user || !user.followers) return [];

      return user.followers.map((follower) => {
        return {
          id: follower.user_id,
          username: follower.username,
          profilePicture: follower.profile_picture,
        };
      });
    } catch (error) {
      console.error("❌ Erreur getFollowers:", error);
      throw new Error("Impossible de récupérer la liste des followers.");
    }
  },
};

