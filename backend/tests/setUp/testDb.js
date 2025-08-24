import { sequelize, User } from '../../models/index.js';

/**
 * =====================================================
 * CONFIGURATION BASE DE DONNÉES TEST
 * =====================================================
 * 
 * Setup pour tests unitaires avec DB séparée (skillshare_test)
 * - Crée/supprime tables à chaque test
 * - Ajoute des utilisateurs fictifs
 * - Isole complètement les tests des données de développement
 * =====================================================
 */

/**
 * Initialisation base de données test
 * - Synchronise les modèles (crée les tables)
 * - Ajoute des données de test
 */
export const setupTestDb = async () => {
  try {
    // Force sync = supprime et recrée toutes les tables
    // ⚠️ ATTENTION : Efface toutes les données existantes !
    await sequelize.sync({ force: true });
    console.log('Tables test créées');

    // Créer des utilisateurs de test 
    await User.bulkCreate([
      {
        user_id: 1,
        first_name: 'Shigeru',
        last_name: 'Miyamoto',
        username: 'miyamoto_test',
        email: 'shigeru@test.com',
        password: 'hashedpassword123', // En vrai, devrait être hashé avec argon2
        birthdate: '1952-11-16',
        gender: 'M',
        content: 'Créateur de Mario, Zelda, Donkey Kong. Compétences: Game Design, Innovation, Direction créative',
        profile_picture: 'https://example.com/miyamoto.jpg'
      },
      {
        user_id: 2,
        first_name: 'Bill',
        last_name: 'Gates',
        username: 'billgates_test',
        email: 'bill@test.com',
        password: 'hashedpassword456',
        birthdate: '1955-10-28',
        gender: 'M',
        content: 'Co-fondateur Microsoft. Compétences: Programmation, Stratégie, Philanthropie',
        profile_picture: 'https://example.com/billgates.jpg'
      },
      {
        user_id: 3,
        first_name: 'Satya',
        last_name: 'Nadella',
        username: 'satyanadella_test',
        email: 'satya@test.com',
        password: 'hashedpassword789',
        birthdate: '1967-08-19',
        gender: 'M',
        content: 'CEO Microsoft. Compétences: Cloud Computing, Transformation digitale',
        profile_picture: 'https://example.com/satya.jpg'
      }
    ]);
    console.log('Utilisateurs test créés (Miyamoto, Gates, Nadella)');
    
  } catch (error) {
    console.error('❌ Erreur setup DB test:', error);
    throw error;
  }
};

/**
 * Nettoyage après tous les tests
 * Ferme proprement la connexion à la base de données
 */
export const teardownTestDb = async () => {
  try {
    await sequelize.close();
    console.log('Connexion DB test fermée');
  } catch (error) {
    console.error('❌ Erreur teardown:', error);
  }
};

/**
 * Nettoyage entre les tests (optionnel)
 * Vide les tables sans les supprimer
 */
export const cleanTestDb = async () => {
  try {
    // Vider les tables dans l'ordre (à cause des contraintes FK)
    await sequelize.query('TRUNCATE TABLE messages, conversations RESTART IDENTITY CASCADE');
    console.log('Tables messages/conversations vidées');
  } catch (error) {
    console.error('❌ Erreur nettoyage:', error);
  }
};