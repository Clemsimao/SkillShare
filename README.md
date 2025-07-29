# SkillSwap

## Présentation Générale

- **Quoi ?** Création de la plateforme SkillSwap, un site permettant l'échange de compétences et de connaissances au sein d'une communauté.
- **Qui ?** SkillSwap (fictif) part du principe selon lequel chacun a quelque chose d'unique à offrir, que ce soit en matière de compétences professionnelles, de talents artistiques, de connaissances linguistiques, de passe-temps, etc. et vise à encourager l'apprentissage mutuel, la collaboration et l'établissement de relations dans un environnement convivial.
- **Pour qui ?** Pour un public intéressé par l'apprentissage, le partage de compétences et le développement personnel et professionnel.
- **Comment ?** En équipe à définir (positionnement via un formulaire de voeux) par l'équipe pédagogique. Organisation en méthode agile pour la gestion de projet.
- **Quand ?** En plusieurs sprints qui inclueront des tâches de : conception, code, déploiement, recettage, etc.
- **Pourquoi ?** Pour la réalisation d'un projet fictif à but pédagogique visant l'obtention du Titre Professionnel.

## Présentation du Projet de Développement

### Besoins Fonctionnels (Minimum Viable Product - MVP)

- Landing page avec la présentation de SkillSwap et quelques profils “random”.
- Système d'inscription et de connexion.
- Gestion du profil utilisateur détaillé avec ses compétences, intérêts et disponibilités.
- Moteur de recherche par compétences afin de trouver de potentiels profils correspondants.
- Avoir la possibilité de suivre / ne plus suivre un profil.
- Avoir la possibilité de rentrer en contact avec ce profil pour entamer un échange sur les compétences mutuelles.
- Possibilité d’évaluer un partenaire après échange de compétences.

### Propositions d’évolutions possibles

- Implémentation de la messagerie instantanée via WebSockets.
- Système de recherche avancé avec plus de filtres et possibilités : lieu de vie, disponibilités, etc.
- Système de notifications pour informer les utilisateurs des notes, des messages, etc.
- Avoir la possibilité de bloquer / débloquer un profil qui nous suit.
- Mise en place d’un back office pour la gestion admin des profils de la plateforme.
- Suggérer automatiquement des profils compatibles en fonction des compétences, des intérêts ou des évaluations précédentes.
- Système de badges ou de récompenses pour les utilisateurs les plus actifs ou les plus impliqués.
- Création de groupes ou communautés spécifiques pour des échanges de compétences plus ciblés.
- Système de modération pour gérer les contenus inappropriés ou les comportements abusifs.
- Système de notifications plus avancé pour rappeller aux utilisateurs les rendez-vous programmés ou des échanges en attente.
- Support multilingue : au moins anglais et français.

### Contraintes Techniques (notamment liées au TP)

- **Technologies** : choix libres mais justifiés.
- **Sécurité :** authentification sécurisée, protection contre les failles courantes (XSS, injections SQL, etc.).
- **Déploiement :** rédaction a minima d'une procédure de déploiement (CI/CD en bonus).
- **Responsive :** application développée en mobile first et responsive.
- **Accessibilité :** respect des normes d'accessibilité web [WCAG](https://www.w3.org/Translations/WCAG20-fr/).
- **RGPD et mentions légales :** mettre en place les mentions légales liées au règlement général sur la protection des données (RGPD).
- **Versionning :** utilisation de Git et GitHub.
- **API** : en consommer au moins une (qu’elle soit interne ou externe). Un seul appel peut être suffisant, l’API ne doit pas forcément être utilisée pour tout le projet.
- **SEO** : appliquer les bonnes pratiques visant à maximiser le référencement du projet.
- **Tests** : plan de tests couvrant les fonctionnalités principales du projet.
- **Conteneurisation (Docker)** : pour l'environnement de développement voire pour le déploiement
- **Démarche d'éco-conception** (optimisation des images, minification des fichiers, etc.).

### Informations & Ressources complémentaires

- Ne pas hésiter à utiliser des contenus “lorem ipsum” au moins le temps d'avoir un MVP fonctionnel.
- Inspiration graphique : sites comme [Yakasaider](https://www.yakasaider.fr/) et [Wooskill](https://www.wooskill.com/fr) (et bien d’autres) pour une interface utilisateur accueillante.

## Pour terminer

- Le projet est libre d'interprétation, l'équipe peut proposer ses propres choix techniques et fonctionnels. Il est donc évolutif et il ne faut pas hésiter à se l'approprier.
- L'accent doit être mis sur l'apprentissage et la mise en pratique des compétences acquises pendant la formation (objectif TP).
- L'équipe pédagogique assure l'accompagnement et conseille tout au long du projet. Elle interviendra aussi lors de la validation des choix techniques et fonctionnels. Elle sera garante de l'évaluation de la progression en vue de se préparer au mieux pour le TP.
- L'équipe pédagogique n'est en aucun cas positionnée en tant que représentante du client fictif du projet proposé.

:arrow_right: [Attendus sur le sprint 0](../.github/ISSUE_TEMPLATE/sp0-suivi-conception.md), dédié à la conception.