/**
 * =====================================================
 * SETUP GLOBAL JEST
 * =====================================================
 * 
 * Fichier exécuté AVANT tous les tests
 * - Configure les variables d'environnement pour tests
 * - Switch automatiquement vers la DB test
 * - Setup global pour tous les fichiers de test
 * =====================================================
 */

// Forcer l'utilisation de la DB test pour tous les tests
process.env.NODE_ENV = 'test';

// Remplacer l'URL de la DB par la version test
process.env.DATABASE_URL = 'postgresql://skillshare:skillshare@postgres:5432/skillshare_test';

// Autres configs spécifiques aux tests
process.env.JWT_SECRET = 'test_jwt_secret_key';

console.log('Configuration test activée - DB: skillshare_test');