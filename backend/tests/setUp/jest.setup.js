import { testDb } from './testDb.js';

// Setup global avant tous les tests
beforeAll(async () => {
  await testDb.setup();
});

// Nettoyage global après tous les tests  
afterAll(async () => {
  await testDb.teardown();
});

// Configuration Jest - pas de jest.setTimeout() dans setup files
// Le timeout est géré dans package.json: "testTimeout": 10000