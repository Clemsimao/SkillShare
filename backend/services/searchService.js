import { User, Tutorial, Skill, Category, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const searchService = {
  /**
   * Recherche d'utilisateurs par compétence, catégorie ou texte
   */
  async searchUsers({ skillId, categoryId, q, page = 1, limit = 10 }) {
    try {
      // PAGINATION
      const offset = (page - 1) * limit;

      // 1. FILTRE UTILISATEUR (Recherche textuelle)
      let userWhere = {};
      if (q) {
        const searchTerm = `%${q}%`;
        userWhere = {
          [Op.or]: [
            { username: { [Op.iLike]: searchTerm } },
            { first_name: { [Op.iLike]: searchTerm } },
            { last_name: { [Op.iLike]: searchTerm } },
            // Recherche concaténée nom complet (postgres specific)
            sequelize.where(
              sequelize.fn('concat', sequelize.col('first_name'), ' ', sequelize.col('last_name')),
              { [Op.iLike]: searchTerm }
            )
          ]
        };
      }

      // 2. FILTRE COMPETENCE (Si skillId ou categoryId fourni)
      let includeSkillObj = {
        model: Skill,
        as: 'skills',
        through: { attributes: [] },
        include: [{ model: Category, as: 'category' }]
      };

      if (skillId || categoryId) {
        includeSkillObj.where = skillId ? { skill_id: skillId } : { category_id: categoryId };
        includeSkillObj.required = true; // INNER JOIN si on filtre par skill
      } else {
        includeSkillObj.required = false; // LEFT JOIN si on cherche juste par texte
      }

      const users = await User.findAll({
        where: userWhere,
        attributes: { exclude: ['password'] },
        include: [includeSkillObj],
        limit,
        offset,
        order: [['created_at', 'DESC']],
        distinct: true
      });

      const totalCount = await User.count({
        where: userWhere,
        include: [includeSkillObj],
        distinct: true
      });

      return {
        data: users.map(user => ({
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          username: user.username,
          profilePicture: user.profile_picture,
          skills: user.skills ? user.skills.map(skill => ({
            id: skill.skill_id,
            title: skill.title,
            category: skill.category ? skill.category.title : null
          })) : []
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
   * Recherche de tutoriels par compétence, catégorie ou texte (titre)
   */
  async searchTutorials({ skillId, categoryId, q, page = 1, limit = 10 }) {
    try {
      const offset = (page - 1) * limit;

      // 1. FILTRE TUTORIEL (Recherche textuelle)
      let tutorialWhere = {};
      if (q) {
        tutorialWhere = {
          title: { [Op.iLike]: `%${q}%` }
        };
      }

      // 2. FILTRE COMPETENCE (via Auteur -> Skills)
      // Note: La logique initiale filtrait les tutoriels écrits par des AUTEURS ayant la compétence.
      // Si on cherche par texte, on veut peut-être juste les tutos qui match le titre, peu importe l'auteur.
      // Si skillId est là, on garde la restriction.

      let includeAuthorObj = {
        model: User,
        as: 'author',
        attributes: ['user_id', 'first_name', 'last_name', 'username', 'profile_picture'],
        include: []
      };

      if (skillId || categoryId) {
        const authorSkillWhere = skillId ? { skill_id: skillId } : { category_id: categoryId };
        includeAuthorObj.include.push({
          model: Skill,
          as: 'skills',
          through: { attributes: [] },
          where: authorSkillWhere,
          required: true,
          include: [{ model: Category, as: 'category' }]
        });
      } else {
        // Si pas de filtre skill, on charge quand même les skills de l'auteur pour l'affichage (optionnel)
        includeAuthorObj.include.push({
          model: Skill,
          as: 'skills',
          through: { attributes: [] },
          include: [{ model: Category, as: 'category' }]
        });
      }

      const tutorials = await Tutorial.findAll({
        where: tutorialWhere,
        include: [includeAuthorObj],
        limit,
        offset,
        order: [['published_at', 'DESC']],
        distinct: true
      });

      const totalCount = await Tutorial.count({
        where: tutorialWhere,
        include: [includeAuthorObj],
        distinct: true
      });

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
            skills: tutorial.author.skills ? tutorial.author.skills.map(skill => skill.title) : []
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