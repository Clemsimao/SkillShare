// IMPORTANT : Charger la DB de test AVANT d'importer les modèles
process.env.DATABASE_URL = 'postgresql://skillshare:skillshare@postgres:5432/skillshare_test';

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import sequelize from '../config/database.js';

// MAINTENANT on peut importer les modèles (ils utiliseront la bonne DB)
import { User, Skill, Category, UserSkill } from '../models/index.js';
import { searchService } from '../services/searchService.js';

// SETUP : Créer les tables au démarrage (force: true = DROP et recrée)
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// TEARDOWN : Fermer la connexion à la fin
afterAll(async () => {
  await sequelize.close();
});

describe('searchService.searchUsers', () => {
  
  // TEST 1 : Recherche par skillId (cas nominal)
  it('devrait trouver un user par skillId', async () => {
    // Arrange : Créer les données de test
    const category = await Category.create({ title: 'Dev', content: 'Développement web' });
    const skill = await Skill.create({ 
      title: 'JavaScript', 
      content: 'Langage de programmation web',
      category_id: category.category_id 
    });
    const user = await User.create({
      first_name: 'Grace',
      last_name: 'Hopper',
      username: 'gracehopper',
      email: 'grace@test.com',
      password: 'hash123',
      birthdate: '1906-12-09',
      content: 'Computer scientist and US Navy rear admiral'
    });
    // Créer le lien user ↔ skill dans la table de liaison
    await UserSkill.create({ user_id: user.user_id, skill_id: skill.skill_id });
    
    // Act : Appeler le service
    const result = await searchService.searchUsers({ skillId: skill.skill_id });
    
    // Assert : Vérifier le résultat
    expect(result.data).toHaveLength(1);
    expect(result.data[0].username).toBe('gracehopper');
    expect(result.pagination.totalCount).toBe(1);
  });

  // TEST 2 : Erreur sans paramètres (validation)
  it('devrait rejeter une recherche sans skillId ni categoryId', async () => {
    await expect(searchService.searchUsers({})).rejects.toThrow('skillId ou categoryId requis');
  });

  // TEST 3 : Pagination (cas complexe)
  it('devrait paginer correctement les résultats', async () => {
    // Arrange : Créer 15 users avec la même compétence
    const category = await Category.create({ title: 'Dev', content: 'Développement web' });
    const skill = await Skill.create({ 
      title: 'JavaScript', 
      content: 'Langage de programmation web',
      category_id: category.category_id 
    });
    
    for (let i = 1; i <= 15; i++) {
      const user = await User.create({
        first_name: `User${i}`,
        last_name: 'Test',
        username: `user${i}`,
        email: `user${i}@test.com`,
        password: 'hash123',
        birthdate: '1990-01-01',
        content: 'Test user'
      });
      await UserSkill.create({ user_id: user.user_id, skill_id: skill.skill_id });
    }
    
    // Act : Chercher avec limit=10 (page 1)
    const result = await searchService.searchUsers({ skillId: skill.skill_id, page: 1, limit: 10 });
    
    // Assert : Vérifier la pagination
    expect(result.data).toHaveLength(10); // Seulement 10 résultats
    expect(result.pagination.totalCount).toBe(15); // Mais 15 au total
    expect(result.pagination.hasNext).toBe(true); // Il reste une page
    expect(result.pagination.totalPages).toBe(2); // 2 pages au total
  });
});