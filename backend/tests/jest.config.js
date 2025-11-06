/**
 * Configuration Jest pour SkillShare API
 * - testEnvironment: 'node' → Environnement serveur (pas navigateur)
 * - transform: {} → Pas de transformation, on utilise ES modules natifs
 * - testTimeout: 10000 → 10s max par test (requêtes PostgreSQL lentes)
 */

export default {
  testEnvironment: 'node',
  transform: {},
  testTimeout: 10000
};
