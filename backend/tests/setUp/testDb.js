// tests/setup/testDb.js
import 'dotenv/config';
import { sequelize, User, Conversation, Message } from '../../models/index.js';

// Configuration DB test
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://skillshare:skillshare@postgres:5432/skillshare_test';
process.env.JWT_SECRET = 'test_jwt_secret_key';

/**
 * Utilisateurs de test - 
 */
const TEST_USERS = [
  {
    user_id: 1,
    first_name: 'Shigeru',
    last_name: 'Miyamoto',
    username: 'miyamoto_test',
    email: 'shigeru@test.com',
    password: 'hashedpassword123',
    birthdate: '1952-11-16'
  },
  {
    user_id: 2,
    first_name: 'Bill',
    last_name: 'Gates',
    username: 'billgates_test',
    email: 'bill@test.com',
    password: 'hashedpassword456',
    birthdate: '1955-10-28'
  },
  {
    user_id: 3,
    first_name: 'Satya',
    last_name: 'Nadella',
    username: 'nadella_test',
    email: 'satya@test.com',
    password: 'hashedpassword789',
    birthdate: '1967-08-19'
  }
];

export const testDb = {
  /**
   * Initialiser la base de données test
   * Recrée les tables et insère les utilisateurs de test
   */
  async setup() {
    try {
      // Recréer toutes les tables
      await sequelize.sync({ force: true });
      
      // Créer les utilisateurs de test
      await User.bulkCreate(TEST_USERS);
      
      console.log('✅ DB test initialisée avec utilisateurs');
    } catch (error) {
      console.error('❌ Erreur setup DB test:', error);
      throw error;
    }
  },

  /**
   * Nettoyer les données entre tests (garde les users)
   */
  async cleanBetweenTests() {
    try {
      // Supprimer messages et conversations (garde les users)
      await Message.destroy({ where: {} });
      await Conversation.destroy({ where: {} });
    } catch (error) {
      console.error('❌ Erreur nettoyage DB:', error);
      throw error;
    }
  },

  /**
   * Fermer la connexion DB
   */
  async teardown() {
    try {
      await sequelize.close();
      console.log('✅ Connexion DB fermée');
    } catch (error) {
      console.error('❌ Erreur fermeture DB:', error);
      throw error;
    }
  },

  // Helpers pour accès facile aux users dans les tests
  users: {
    miyamoto: { id: 1, name: 'Shigeru Miyamoto' },
    gates: { id: 2, name: 'Bill Gates' },
    nadella: { id: 3, name: 'Satya Nadella' }
  }
};