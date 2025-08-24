# Guide Jest - Tests Unitaires Backend

## Sommaire
- [Introduction à Jest](#introduction)
- [Structure des tests](#structure)
- [Configuration](#configuration)
- [Base de données test](#base-de-données-test)
- [Écriture des tests](#écriture-des-tests)
- [Commandes utiles](#commandes)

---

## Introduction

**Jest** est un framework de test JavaScript développé par Meta (Facebook). Il permet de tester facilement notre backend Node.js avec des fonctionnalités avancées :

- **Assertions** : Vérifier que le code fait ce qu'on attend
- **Mocks** : Simuler des fonctions/modules
- **Coverage** : Mesurer la couverture de code
- **Watch mode** : Relancer les tests automatiquement

---

## Structure

```
backend/
├── tests/
│   ├── setup/
│   │   ├── jest.setup.js      # Configuration globale Jest
│   │   └── testDb.js          # Helpers base de données test
│   └── services/
│       ├── conversationService.test.js
│       └── messageService.test.js
├── package.json               # Configuration Jest
└── ...
```

---

## Configuration

### package.json - Section Jest

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "jest": {
    "testEnvironment": "node",
    "transform": {},
    "testMatch": ["**/tests/**/*.test.js"],
    "setupFilesAfterEnv": ["<rootDir>/tests/setup/jest.setup.js"],
    "testTimeout": 10000
  }
}
```

### Explications configuration

- **`testEnvironment: "node"`** : Environnement Node.js (pas navigateur)
- **`transform: {}`** : Pas de compilation Babel, utilise ES modules natifs
- **`testMatch`** : Où chercher les fichiers de test (`*.test.js`)
- **`setupFilesAfterEnv`** : Fichier exécuté avant chaque test
- **`testTimeout`** : 10s par test (utile pour tests base de données)

---

## Base de données test

### Isolation des données

**⚠️ IMPORTANT** : Les tests utilisent une base séparée `skillshare_test` pour :
- Protéger les données de développement
- Avoir des tests reproductibles
- Permettre les tests destructeurs

### Setup automatique

```javascript
// tests/setup/jest.setup.js
process.env.DATABASE_URL = 'postgresql://skillshare:skillshare@postgres:5432/skillshare_test';
```

### Données de test

Utilisateurs fictifs créés pour les tests :
- **Shigeru Miyamoto** (créateur Mario/Zelda)
- **Bill Gates** (co-fondateur Microsoft)
- **Satya Nadella** (CEO Microsoft)

---

## Écriture des tests

### Structure AAA (Arrange-Act-Assert)

```javascript
test('createOrGetConversation - doit créer nouvelle conversation', async () => {
  // ARRANGE (préparer)
  const userA = 1; // Miyamoto
  const userB = 2; // Gates
  
  // ACT (agir)
  const result = await conversationService.createOrGetConversation(userA, userB);
  
  // ASSERT (vérifier)
  expect(result).toBeDefined();
  expect(result.participants).toHaveLength(2);
});
```

### Matchers Jest courants

```javascript
// Égalité
expect(value).toBe(expected);
expect(value).toEqual(expected);

// Existence
expect(value).toBeDefined();
expect(value).toBeNull();

// Tableaux/Objets
expect(array).toHaveLength(2);
expect(array).toContain(item);
expect(object).toHaveProperty('key');

// Erreurs
expect(() => fn()).toThrow();
await expect(asyncFn()).rejects.toThrow('Message erreur');
```

### Lifecycle hooks

```javascript
beforeAll(async () => {
  // Exécuté UNE fois avant tous les tests
  await setupTestDb();
});

afterAll(async () => {
  // Exécuté UNE fois après tous les tests
  await teardownTestDb();
});

beforeEach(() => {
  // Exécuté avant CHAQUE test
});

afterEach(() => {
  // Exécuté après CHAQUE test
});
```

---

## Commandes

```bash
# Lancer tous les tests
npm test

# Mode watch (relance automatique)
npm run test:watch

# Avec couverture de code
npm run test:coverage

# Lancer un test spécifique
npm test -- conversationService

# Mode verbose (plus de détails)
npm test -- --verbose
```

---

## Workflow de développement

### 1. Red-Green-Refactor (TDD)
1. **Red** : Écrire un test qui échoue
2. **Green** : Écrire le code minimum pour que ça passe
3. **Refactor** : Améliorer le code sans casser les tests

### 2. Tests en premier ou après ?
- **Tests d'abord** : TDD strict, plus rigoureux
- **Code d'abord** : Plus pragmatique, tester ce qui existe

### 3. Que tester ?
- ✅ **Logique métier** : Services, fonctions importantes
- ✅ **Cas limites** : Erreurs, validations
- ❌ **Pas tester** : Getters/setters simples, code trivial

---

## Bonnes pratiques

### Nommage des tests
```javascript
// ✅ BON : Descriptif et clair
test('createOrGetConversation - doit créer une nouvelle conversation entre deux utilisateurs')

// ❌ MAUVAIS : Vague
test('test conversation')
```

### Un test = une responsabilité
```javascript
// ✅ BON : Test focalisé
test('doit créer conversation')
test('doit récupérer conversation existante')

// ❌ MAUVAIS : Test qui fait plusieurs choses
test('doit créer et récupérer conversation')
```

### Tests indépendants
- Chaque test doit pouvoir s'exécuter seul
- Pas de dépendances entre tests
- Nettoyer les données entre tests si nécessaire

---

## Dépannage

### Erreurs courantes

**ES Modules non supportés**
```bash
# Solution : Vérifier package.json
"type": "module",
"jest": { "transform": {} }
```

**Timeout des tests**
```bash
# Solution : Augmenter timeout
"jest": { "testTimeout": 15000 }
```

**Base de données non trouvée**
```bash
# Créer la DB test
docker exec -it skillshare_db psql -U skillshare -c "CREATE DATABASE skillshare_test;"
```

---

## Tests SkillShare - Cas spécifiques

### conversationService Tests
```javascript
// Test création nouvelle conversation
test('createOrGetConversation - nouvelle conversation Miyamoto/Gates')

// Test logique user1_id < user2_id
test('createOrGetConversation - ordre forcé user1_id < user2_id')

// Test récupération conversation existante
test('createOrGetConversation - récupère conversation existante sans doublon')

// Test gestion erreurs
test('createOrGetConversation - erreur si utilisateur inexistant')
test('createOrGetConversation - erreur si auto-conversation (même user)')
```

### messageService Tests  
```javascript
// Test création message
test('createMessage - nouveau message Miyamoto vers Gates')

// Test sécurité conversation
test('createMessage - erreur si utilisateur pas dans conversation')

// Test pagination
test('getMessagesByConversation - pagination fonctionnelle')

// Test lecture messages
test('markAsRead - marque seulement messages reçus')
```

---

## Ressources

- [Documentation Jest](https://jestjs.io/docs/getting-started)
- [Matchers Jest](https://jestjs.io/docs/expect)
- [Testing Node.js](https://nodejs.dev/learn/introduction-to-nodejs)
- [Guide TDD](https://martinfowler.com/bliki/TestDrivenDevelopment.html)