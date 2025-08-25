import { followService } from "../services/followService.js";

// S'abbonner ou se désabonner d'un utilisateur (le toggleFollow)

export const toggleFollow = async (req, res) => {
  try {
    const followerId = req.user.id; // Ici l'ID de l'utilisateur connecté
    const followedId = Number.parseInt(req.params.id, 10); // ID de l'utilisateur ciblé. 10 pour lire la chaîne comme un nombre décimal (en base 10).”

    const result = await followService.toggleFollow(followerId, followedId);

    return res.status(200).json({
      success: true,
      message: result.message,
      isFollowing: result.isFollowing,
      action: result.action,
    });
  } catch (error) {
    console.error("❌ Erreur toggleFollow controller:", error);
    return res.status(500).json({
      success: false,
      message:
        "Impossible de suivre ou de se désabonner de ce compte pour le moment",
    });
  }
};

// Récupérer la liste des utilisateurs suivis (following)

export const getFollowing = async (req, res) => {
  try {
    const userId = req.user.id;
    const followingList = await followService.getFollowing(userId);

    return res.status(200).json({
      success: true,
      message: "La liste des abonnements a été récupérée avec succès.",
      following: followingList,
    });
  } catch (error) {
    console.error("❌ Erreur getFllowing controller:", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer la liste des abonnements.",
    });
  }
};

// Récupérer la liste des followers (followers)

export const getFollowers = async (req, res) => {
  try {
    const userId = req.user.id;
    const followersList = await followService.getFollowers(userId);

    return res.status(200).json({
      success: true,
      message: "La liste des abonnés récupérée avec succès.",
      followers: followersList,
    });
  } catch (error) {
    console.error("❌ Erreur getFollowers controller:", error);
    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer la liste des abonnés.",
    });
  }
};
