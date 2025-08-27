import { User, Tutorial, Skill, Category } from '../models/index.js';

export const searchService = {
  /**
   * Recherche d'utilisateurs par compétence ou catégorie
   */
  async searchUsers({ skillId, categoryId, page = 1, limit = 10 }) {
    try {
      if (!skillId && !categoryId) {
        throw new Error('skillId ou categoryId requis');
      }

      // PAGINATION : Calculer le décalage pour la page demandée
      // Ex: page 2, limit 10 → offset = (2-1)*10 = 10 (ignore les 10 premiers)
      const offset = (page - 1) * limit;
      
      // CONDITION DE RECHERCHE : Soit par compétence précise, soit par catégorie
      // skillId fourni → cherche cette compétence exacte
      // categoryId fourni → cherche toutes les compétences de cette catégorie
      const skillWhere = skillId ? { skill_id: skillId } : { category_id: categoryId };

      const users = await User.findAll({
        // SÉCURITÉ : Exclure le mot de passe des résultats
        attributes: { exclude: ['password'] },
        
        // JOINTURE : Récupérer les compétences de l'utilisateur
        include: [{
          model: Skill,
          as: 'skills', // Nom de l'association définie dans models/index.js
          through: { attributes: [] }, // Masquer la table de liaison user_skills
          where: skillWhere, // Appliquer le filtre de recherche
          required: true, // INNER JOIN - seulement users qui ONT des compétences matchantes
          
          // SOUS-JOINTURE : Récupérer la catégorie de chaque compétence
          include: [{ model: Category, as: 'category' }]
        }],
        
        // PAGINATION : Limiter le nombre de résultats
        limit,  // Nombre max de résultats (ex: 10)
        offset, // Nombre de résultats à ignorer (ex: 20 pour page 3)
        
        // TRI : Les utilisateurs les plus récents en premier
        order: [['created_at', 'DESC']],
        
        // DÉDUPLICATION : Éviter les doublons dus aux relations many-to-many
        distinct: true
      });

      // COMPTAGE TOTAL : Pour la pagination (même requête sans limit/offset)
      const totalCount = await User.count({
        include: [{
          model: Skill,
          as: 'skills',
          through: { attributes: [] },
          where: skillWhere,
          required: true,
          include: [{ model: Category, as: 'category' }]
        }],
        distinct: true
      });

      // FORMATAGE RÉPONSE : Structure standardisée
      return {
        data: users.map(user => ({
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          profilePicture: user.profile_picture,
          skills: user.skills.map(skill => ({
            id: skill.skill_id,
            title: skill.title,
            category: skill.category.title
          }))
        })),
        pagination: {
          page,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      };

    } catch (error) {
      console.error('❌ Erreur searchUsers:', error);
      throw error;
    }
  },

  /**
   * Recherche de tutoriels par compétence ou catégorie (via auteur)
   */
  async searchTutorials({ skillId, categoryId, page = 1, limit = 10 }) {
    try {
      if (!skillId && !categoryId) {
        throw new Error('skillId ou categoryId requis');
      }

      // PAGINATION : Calculer décalage
      const offset = (page - 1) * limit;
      
      // CONDITION RECHERCHE : Filtrer par compétences de l'auteur
      const authorSkillWhere = skillId ? { skill_id: skillId } : { category_id: categoryId };

      const tutorials = await Tutorial.findAll({
        // JOINTURE AUTEUR : Récupérer l'auteur et ses compétences
        include: [{
          model: User,
          as: 'author',
          attributes: ['user_id', 'first_name', 'last_name', 'username', 'profile_picture'],
          
          // JOINTURE COMPÉTENCES AUTEUR : Filtrer par compétences
          include: [{
            model: Skill,
            as: 'skills',
            through: { attributes: [] },
            where: authorSkillWhere,
            required: true, // INNER JOIN - seulement auteurs avec compétences matchantes
            include: [{ model: Category, as: 'category' }]
          }]
        }],
        limit,
        offset,
        // TRI : Tutoriels les plus récents en premier
        order: [['published_at', 'DESC']]
      });

      // COMPTAGE TOTAL : Pour pagination
      const totalCount = await Tutorial.count({
        include: [{
          model: User,
          as: 'author',
          include: [{
            model: Skill,
            as: 'skills',
            through: { attributes: [] },
            where: authorSkillWhere,
            required: true,
            include: [{ model: Category, as: 'category' }]
          }]
        }]
      });

      // FORMATAGE RÉPONSE
      return {
        data: tutorials.map(tutorial => ({
          id: tutorial.tutorial_id,
          title: tutorial.title,
          content: tutorial.content,
          picture: tutorial.picture,
          publishedAt: tutorial.published_at,
          author: {
            id: tutorial.author.user_id,
            username: tutorial.author.username,
            profilePicture: tutorial.author.profile_picture,
            skills: tutorial.author.skills.map(skill => skill.title)
          }
        })),
        pagination: {
          page,
          totalCount,
          totalPages: Math.ceil(totalCount / limit),
          hasNext: page * limit < totalCount
        }
      };

    } catch (error) {
      console.error('❌ Erreur searchTutorials:', error);
      throw error;
    }
  }
};