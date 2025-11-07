# Plan de test pour le searchService de SkillSwap

---

## 1. Informations générales

**Fonctionnalité testée :** Service de recherche d'utilisateurs et de tutoriels par compétences  
**Fichier source :** `backend/services/searchService.js`  
**Fichier de test :** `backend/tests/searchService.test.js`  
**Environnement :** Node.js + PostgreSQL (base de test isolée)  
**Framework :** Jest 30.2.0  

---

## 2. Périmètre des tests

**Fonctions testées :**
- `searchService.searchUsers()`
- `searchService.searchTutorials()` (non testé actuellement)

**Critères d'acceptation :**
- Les utilisateurs peuvent être recherchés par compétence (skillId)
- Les utilisateurs peuvent être recherchés par catégorie (categoryId)
- La pagination fonctionne correctement
- Les erreurs de validation sont gérées
- Les données sensibles (password) sont exclues des résultats

---

## 3. Stratégie de test

**Type de tests :** Tests unitaires  
**Approche :** Pattern AAA (Arrange-Act-Assert)  
**Isolation :** Base de données de test dédiée (`skillshare_test`)  
**Données de test :** Fixtures créées dynamiquement dans chaque test

---

## 4. Cas de test

### Test 1 : Recherche par skillId (cas nominal)

**Objectif :** Vérifier qu'un utilisateur possédant une compétence est trouvé

**Pré-requis :**
- Base de données vide
- Une catégorie "Dev" existe
- Une compétence "JavaScript" existe dans cette catégorie
- Un utilisateur "Grace Hopper" possède cette compétence

**Étapes :**
1. Créer une catégorie
2. Créer une compétence liée à cette catégorie
3. Créer un utilisateur
4. Lier l'utilisateur à la compétence (table user_skills)
5. Appeler `searchService.searchUsers({ skillId })`

**Résultat attendu :**
- Un utilisateur est retourné
- Le username est "gracehopper"
- Le champ password n'est pas présent
- pagination.totalCount = 1

**Statut :** PASS

---

### Test 2 : Validation des paramètres (cas d'erreur)

**Objectif :** Vérifier que le service rejette une recherche sans critères

**Pré-requis :** Base de données vide

**Étapes :**
1. Appeler `searchService.searchUsers({})` sans paramètres

**Résultat attendu :**
- Une erreur est levée
- Message d'erreur : "skillId ou categoryId requis"

**Statut :** PASS

---

### Test 3 : Pagination (cas complexe)

**Objectif :** Vérifier que la pagination limite correctement les résultats

**Pré-requis :**
- Base de données vide
- Une catégorie "Dev" existe
- Une compétence "JavaScript" existe
- 15 utilisateurs possèdent cette compétence

**Étapes :**
1. Créer une catégorie et une compétence
2. Créer 15 utilisateurs (User1 à User15)
3. Lier tous les utilisateurs à la compétence
4. Appeler `searchService.searchUsers({ skillId, page: 1, limit: 10 })`

**Résultat attendu :**
- 10 résultats retournés (pas 15)
- pagination.totalCount = 15
- pagination.hasNext = true
- pagination.totalPages = 2

**Statut :** PASS

---

## 5. Cas de test non couverts (à implémenter)

### Test 4 : Recherche par categoryId
**Priorité :** Moyenne  
**Description :** Vérifier qu'on peut chercher par catégorie au lieu de compétence spécifique

### Test 5 : Résultats vides
**Priorité :** Basse  
**Description :** Vérifier le comportement quand aucun utilisateur ne correspond

### Test 6 : Tri des résultats
**Priorité :** Basse  
**Description :** Vérifier que les résultats sont triés par created_at DESC

### Test 7 : searchTutorials par skillId
**Priorité :** Haute  
**Description :** Tester la recherche de tutoriels (fonction non testée actuellement)

### Test 8 : Pagination page 2
**Priorité :** Basse  
**Description :** Vérifier que page=2 retourne les 5 résultats restants (sur 15 total)

---

## 6. Configuration de l'environnement de test

**Base de données :**
- Nom : `skillshare_test`
- Utilisateur : `skillshare`
- Host : `postgres` (container Docker)
- Port : 5432

**Isolation de la base de test :**
- La variable `DATABASE_URL` est forcée à pointer vers `skillshare_test` AVANT l'import des modèles
- Cela garantit que tous les modèles Sequelize utilisent la base de test et non la base de production
- Les tests sont donc véritablement isolés de la base de données de développement

**Commandes :**
```bash
# Créer la base de test (une seule fois)
docker exec -it skillshare_db psql -U skillshare -c "CREATE DATABASE skillshare_test;"

# Lancer les tests
docker exec -it skillshare_back npm test
```

**Configuration :**
- `package.json` : Le script `test` définit `DATABASE_URL` avant d'exécuter Jest
- `searchService.test.js` : Force `process.env.DATABASE_URL` avant les imports de modèles

**Dépendances :**
- jest: 30.2.0
- sequelize: 6.37.7
- pg: 8.16.3
---

## 7. Résultats des tests

| Test | Statut | Temps | Note |
|------|--------|-------|------|
| Recherche par skillId | PASS | 120ms | - |
| Validation paramètres | PASS | 59ms | console.error attendu |
| Pagination | PASS | 122ms | - |

**Taux de couverture :** 3/8 cas de test implémentés (37.5%)  
**Tests passants :** 3/3 (100%)  
**Temps total :** 1.459s

---

## 8. Problèmes connus

**Warning Jest :**
```
Jest did not exit one second after the test run has completed
```
**Impact :** Mineur - connexions async non fermées parfaitement  

**Console.error dans Test 2 :**
**Impact :** Aucun - comportement attendu pour tester la gestion d'erreur  
**Solution :** Normal, peut être masqué avec `jest.spyOn(console, 'error')`

---

## 9. Recommandations

**Court terme :**
- Implémenter le Test 7 (searchTutorials) - fonctionnalité non testée
- Ajouter le Test 4 (recherche par categoryId) - cas d'usage important

**Moyen terme :**
- Implémenter les tests 5, 6, 8 pour couverture complète
- Résoudre le warning Jest avec un meilleur cleanup des connexions

**Long terme :**
- Tests d'intégration avec le contrôleur searchController
- Tests de performance (recherche avec 1000+ utilisateurs)
- Tests de sécurité (injection SQL, XSS)

---

## 10. Conclusion

Les tests unitaires du searchService sont fonctionnels et valident les cas d'usage principaux. La configuration Jest est réutilisable pour tester d'autres services. Pour un projet de formation, le niveau de tests actuel est suffisant pour démontrer la maîtrise des tests unitaires backend.