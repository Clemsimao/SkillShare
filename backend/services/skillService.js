import { User, Skill, Category, UserSkill, UserInterest, Op } from '../models/index.js';

export const skillService = {
  /**
   * Récupérer toutes les compétences avec leurs catégories
   * @returns {Array} Liste des compétences
   */
  async getAllSkills() {
    try {
      const skills = await Skill.findAll({
        include: [{
          association: 'category',
          attributes: ['category_id', 'name']
        }],
        order: [
          ['category', 'name', 'ASC'], // Trier par catégorie
          ['name', 'ASC']              // puis par nom de skill
        ]
      });

      return skills.map(skill => ({
        id: skill.skill_id,
        name: skill.name,
        category: {
          id: skill.category.category_id,
          name: skill.category.name
        }
      }));

    } catch (error) {
      console.error('❌ Erreur getAllSkills:', error);
      throw new Error('Erreur lors de la récupération des compétences');
    }
  },

  /**
   * Récupérer toutes les catégories
   * @returns {Array} Liste des catégories
   */
  async getAllCategories() {
    try {
      const categories = await Category.findAll({
        order: [['name', 'ASC']]
      });

      return categories.map(category => ({
        id: category.category_id,
        name: category.name
      }));

    } catch (error) {
      console.error('❌ Erreur getAllCategories:', error);
      throw new Error('Erreur lors de la récupération des catégories');
    }
  },

  /**
   * Ajouter une compétence à un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} skillId - ID de la compétence
   * @returns {Object} Résultat de l'ajout
   */
  async addSkillToUser(userId, skillId) {
    try {
      // Vérifier que la compétence existe
      const skill = await Skill.findByPk(skillId);
      if (!skill) {
        throw new Error('Compétence non trouvée');
      }

      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier si l'association existe déjà
      const existingSkill = await UserSkill.findOne({
        where: { user_id: userId, skill_id: skillId }
      });

      if (existingSkill) {
        throw new Error('Cette compétence est déjà associée à votre profil');
      }

      // Créer l'association
      await UserSkill.create({
        user_id: userId,
        skill_id: skillId
      });

      return {
        id: skill.skill_id,
        name: skill.name,
        message: 'Compétence ajoutée avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur addSkillToUser:', error);
      throw error;
    }
  },

  /**
   * Retirer une compétence d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} skillId - ID de la compétence
   * @returns {boolean} Succès de la suppression
   */
  async removeSkillFromUser(userId, skillId) {
    try {
      const deletedRows = await UserSkill.destroy({
        where: { user_id: userId, skill_id: skillId }
      });

      if (deletedRows === 0) {
        throw new Error('Compétence non trouvée dans votre profil');
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur removeSkillFromUser:', error);
      throw error;
    }
  },

  /**
   * Ajouter un intérêt à un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} skillId - ID de la compétence/intérêt
   * @returns {Object} Résultat de l'ajout
   */
  async addInterestToUser(userId, skillId) {
    try {
      // Vérifier que la compétence existe
      const skill = await Skill.findByPk(skillId);
      if (!skill) {
        throw new Error('Compétence non trouvée');
      }

      // Vérifier que l'utilisateur existe
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier si l'association existe déjà
      const existingInterest = await UserInterest.findOne({
        where: { user_id: userId, skill_id: skillId }
      });

      if (existingInterest) {
        throw new Error('Cet intérêt est déjà associé à votre profil');
      }


      // Créer l'association
      await UserInterest.create({
        user_id: userId,
        skill_id: skillId
      });

      return {
        id: skill.skill_id,
        name: skill.name,
        message: 'Intérêt ajouté avec succès'
      };

    } catch (error) {
      console.error('❌ Erreur addInterestToUser:', error);
      throw error;
    }
  },

  /**
   * Retirer un intérêt d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @param {number} skillId - ID de la compétence/intérêt
   * @returns {boolean} Succès de la suppression
   */
  async removeInterestFromUser(userId, skillId) {
    try {
      const deletedRows = await UserInterest.destroy({
        where: { user_id: userId, skill_id: skillId }
      });

      if (deletedRows === 0) {
        throw new Error('Intérêt non trouvé dans votre profil');
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur removeInterestFromUser:', error);
      throw error;
    }
  },

  /**
   * Récupérer les compétences d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Array} Liste des compétences de l'utilisateur
   */
  async getUserSkills(userId) {
    try {
      const userSkills = await UserSkill.findAll({
        where: { user_id: userId },
        include: [{
          model: Skill,
          as: 'skill',
          include: [{
            model: Category,
            as: 'category'
          }]
        }]
      });

      return userSkills.map(userSkill => ({
        id: userSkill.skill.skill_id,
        name: userSkill.skill.name,
        category: {
          id: userSkill.skill.category.category_id,
          name: userSkill.skill.category.name
        }
      }));

    } catch (error) {
      console.error('❌ Erreur getUserSkills:', error);
      throw new Error('Erreur lors de la récupération des compétences utilisateur');
    }
  },

  /**
   * Récupérer les intérêts d'un utilisateur
   * @param {number} userId - ID de l'utilisateur
   * @returns {Array} Liste des intérêts de l'utilisateur
   */
  async getUserInterests(userId) {
    try {
      const userInterests = await UserInterest.findAll({
        where: { user_id: userId },
        include: [{
          model: Skill,
          as: 'skill',
          include: [{
            model: Category,
            as: 'category'
          }]
        }]
      });

      return userInterests.map(userInterest => ({
        id: userInterest.skill.skill_id,
        name: userInterest.skill.name,
        category: {
          id: userInterest.skill.category.category_id,
          name: userInterest.skill.category.name
        }
      }));

    } catch (error) {
      console.error('❌ Erreur getUserInterests:', error);
      throw new Error('Erreur lors de la récupération des intérêts utilisateur');
    }
  }
};