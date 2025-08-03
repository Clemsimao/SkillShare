# Analyse des risques - Projet SkillShare

## Risques généraux

| Risque | Impact | Probabilité | Gravité | Solutions / Préventions |
|--------|--------|-------------|---------|--------------------------|
| Retard dans le développement | Délai de livraison du projet dépassé | Moyenne | Élevée | Planifier des sprints courts, prioriser le MVP, suivi régulier |
| Difficulté technique | Blocage sur certaines fonctionnalités | Moyenne | Moyenne | Recherche, formation, demander de l’aide, prototypage |
| Problèmes de communication | Mauvaise compréhension des besoins | Faible | Moyenne | Réunions fréquentes, documentation claire, feedback constant |
| Bugs / erreurs dans l’application | Mauvaise expérience utilisateur | Élevée | Moyenne | Tests unitaires, tests d’intégration, phase de QA |
| Problèmes de sécurité | Fuite ou perte de données utilisateur | Faible | Très élevée | Mise en place de bonnes pratiques (authentification, chiffrement) |
| Non adoption par les utilisateurs | Faible taux d’inscription / d’usage | Moyenne | Moyenne | Étude de marché, recueillir des feedbacks, améliorer UX/UI |
| Dépendance à une technologie tierce | Interruption ou changement majeur non prévu | Faible | Moyenne | Choisir des technologies stables, prévoir alternatives |
| Perte de données | Suppression accidentelle ou corrompue | Faible | Élevée | Sauvegardes régulières, versioning, procédures de récupération |

## Risques liés à Git et GitHub

| Risque | Impact | Probabilité | Gravité | Solutions / Préventions |
|--------|--------|-------------|---------|--------------------------|
| Mauvaise utilisation de Git | Perte de commits, conflits difficiles à résoudre | Moyenne | Moyenne | Former les membres, documenter les bonnes pratiques Git |
| Mauvais usage des branches | Conflits ou écrasement de code | Moyenne | Moyenne | Utiliser Git Flow ou un workflow clair, revoir les PR systématiquement |
| Non-push régulier sur GitHub | Perte de l’historique local en cas de panne | Moyenne | Élevée | Pousser régulièrement, utiliser des sauvegardes automatiques |
| Mauvaise gestion des conflits | Blocage lors des fusions | Moyenne | Moyenne | Résolution en pair programming, former à la résolution de conflits |
| Répertoire GitHub supprimé par erreur | Perte complète du projet | Faible | Très élevée | Activer les protections sur la branche principale, backups réguliers |

## Risques techniques

| Risque | Impact | Probabilité | Solutions / Préventions |
|--------|--------|-------------|--------------------------|
| Difficultés de modélisation des relations complexes | Élevé | Moyenne | Préparer le MCD/MLD en amont, bien définir les associations Sequelize |
| Problèmes de synchronisation Sequelize ↔ PostgreSQL | Moyen | Moyenne | Ne pas utiliser `force: true` en production, tester les migrations |
| Mauvaise gestion des erreurs serveur | Élevé | Moyenne | Ajouter des middlewares d’erreurs, utiliser `express-validator` |
| Manque de sécurité (XSS, injections SQL, JWT) | Élevé | Moyenne à Élevée | Valider les entrées, sécuriser les routes, utiliser `helmet` et `cors` |
| Problèmes liés à l’upload de fichiers (Cloudinary) | Élevé | Moyenne | Vérifier les types de fichiers, sécuriser les endpoints |

## Risques humains / organisationnels

| Risque | Impact | Probabilité | Solutions / Préventions |
|--------|--------|-------------|--------------------------|
| Manque de maîtrise sur Express ou Sequelize | Moyen | Moyenne | Prévoir un temps de montée en compétence avec petits projets tests |
| Mauvaise estimation du temps ou de la charge | Élevé | Élevée | Travailler avec un MVP, découper en tâches claires |
| Travail non sauvegardé ou mal versionné | Élevé | Moyenne | Utiliser Git, commits réguliers, branches thématiques |
| Dépendance à des services externes (ex: Cloudinary) | Moyen | Moyenne | Prévoir des alternatives, sécuriser les appels externes |
| Difficultés de coordination dans une équipe de 5 | Désorganisation, travail redondant ou conflits interpersonnels | Moyenne | Moyenne à Élevée | Définir clairement les rôles, mettre en place un gestionnaire de tâches (GitHub Projects), organiser des points réguliers de synchronisation |

## Risques liés à la base de données

| Risque | Impact | Probabilité | Solutions / Préventions |
|--------|--------|-------------|--------------------------|
| Perte de données | Élevé | Faible | Sauvegardes régulières avec `pg_dump`, versionnage des migrations |
| Migrations erronées ou destructives | Élevé | Moyenne | Tester toutes les migrations en staging, prévoir des scripts de rollback |
| Erreurs de conception de modèle | Élevé | Moyenne | Valider le MLD avant d’implémenter, faire des tests avec des données fictives |

## Risques UX / front-end

| Risque | Impact | Probabilité | Solutions / Préventions |
|--------|--------|-------------|--------------------------|
| Interface peu intuitive pour l’utilisateur | Moyen à Élevé | Moyenne | Créer des maquettes, tester avec utilisateurs ciblés |
| Mauvaise gestion des états (React/Next.js) | Moyen | Moyenne | Bien structurer les composants, utiliser des hooks adaptés |

## Risques de sécurité

| Risque | Impact | Probabilité | Solutions / Préventions |
|--------|--------|-------------|--------------------------|
| Données sensibles mal protégées | Élevé | Moyenne | Hacher les mots de passe (`bcrypt`), utiliser JWT de manière sécurisée |
| Accès non autorisé aux routes sensibles | Élevé | Moyenne | Mettre en place des middlewares d’authentification et de rôles |
| Mauvaise configuration CORS ou headers HTTP | Moyen | Moyenne | Bien configurer `cors`, `helmet` et les en-têtes HTTP |
