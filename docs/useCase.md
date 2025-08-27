# MVP - v1

## Fonctionnalités de base

## Landing page

    UC1 - Consulter la présentation de SkillSwap
      Acteur principal : Visiteur
      Objectif : Consulter page d'accueil de SkillSwap 
      Conditions: Accéder à la page d'accueil
      Résultat attendu : Comprendre le concept du site/application

    UC2 - Voir des profils d'exemples
      Acteur principal : Visiteur
      Objectif : Voir quelques profils d'exemples / tutoriels
      Conditions: Accéder à la page d'accueil
      Résultat attendu : Visualiser un échantillon de ce que propose SkillSwap

### Inscription/Connexion

    UC3 - Inscription d'un nouvel utilisateur 
      Acteur principal : Visiteur
      Objectif : Créer un compte pour rejoindre la communauté 
      Conditions: Pas de connexion active à un compte existant
      Résultat attendu : Création d'un compte / profil

    UC4 - Connexion à un profil 
      Acteur principal : Visiteur
      Objectif : Se connecter à son profil 
      Conditions: Avoir un profil existant et ne pas être connecté
      Résultat attendu : Connexion à un compte / profil
    
    UC5 - Deconnexion à un profil 
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Se deconnceter d'une session membre 
      Conditions: Etre connecté à un profil existant
      Résultat attendu : Retour à un statut de "visiteur"

### Système de profil
  
    UC6 - Renseignement des compétences
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Renseigner des compétences afin d'être mieux référencé à la communauté 
      Conditions: Renseigner parmi les compétences proposées par la plateforme SkillSwap
      Résultat attendu : Affichage de compétences propres au membre sur son profil
  
    UC7 - Renseignement des interêts  
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Renseigner des centres d'interêts afin d'affiner ses recherches
      Conditions: Renseigner parmi les interêts proposées par la plateforme SkillSwap
      Résultat attendu : Affichage des interêts sur le profil d'un membre

    UC8 - Mettre à jour son profil
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Mettre à jour ses caractéristiques / renseignements profil
      Conditions: Renseigner son profil grâce à des catégories prédéfinies (Nom? Prénom? Age? Pseudo? Sexe? Photo de profil? Localisation? Interêts?)
      Résultat attendu: Mettre à jour son profil de membre

    UC9 - Supprimer son profil
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Supprimer sa page de profil
      Conditions: Supprimer un profil existant dont on est l'auteur
      Résultat attendu: Supprimer son profil de membre
       
## Fonctionnalités d'échange

### Système de tutoriel

    UC10 - Créer un tutoriel dont je suis l'auteur 
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Créer un tutoriel sur la plateforme
      Conditions: Elaborer, à l'aide d'un template, une publication
      Résultat attendu : Affichage d'un tutoriel consultable par les membres de la plateforme

    UC11 - Consulter un tutoriel dont je suis l'auteur
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Consulter un tutoriel pour le modifier
      Conditions: Etre membre inscrit, connecté et être l'auteur du tutoriel
      Résultat attendu : Affichage d'un tutoriel de notre choix dont on est l'auteur
  
    UC12 - Modifier un tutoriel dont je suis l'auteur 
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Modifier son tutoriel pour l'améliorer / refondre
      Conditions: Etre membre inscrit, connecté et être l'auteur du tutoriel
      Résultat attendu : Prise en compte des changements apportés au tutoriel
  
    UC13 - Supprimer un tutoriel dont je suis l'auteur 
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Supprimer un tutoriel dont on est l'auteur sur la plateforme
      Conditions: Etre membre inscrit, connecté et être l'auteur du tutoriel
      Résultat attendu : Suppresion du tutoriel
  
    UC14 - Consulter un tutoriel dont je ne suis pas l'auteur
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Consulter un tutoriel pour apprendre une compétence
      Conditions: Etre un membre et connecté
      Résultat attendu : Affichage d'un tutoriel

### Moteur de recherche

    UC15 - Recherche des compétences
      Acteur principal : Visiteur
      Objectif : Rechercher des compétences dans le formulaire de recherche
      Conditions: Rechercher parmi les compétences proposées
      Résultat attendu : Trouver un auteur
      
    UC16 - Recherche des compétences
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Rechercher des compétences dans le formulaire de recherche
      Conditions: Rechercher parmi les compétences proposées
      Résultat attendu : Trouver un auteur

    UC17 - Visualisation des profils
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Voir les profils suite à la recherche effectuée
      Conditions: Choisir parmi les profils affichés dans les résultats 
      Résultat attendu : Choisir un auteur

    UC18 - Visualisation des détails d’un profil
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Voir les détails d’un profil 
      Conditions: Cliquer un profil pour voir ses détails
      Résultat attendu : Evaluer si une compétence est correspondante à mes critères

### Système de contact

    UC19 - Intéraction avec un auteur/tuto via commentaire
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Poster un commentaire interagir/échanger avec l'auteur 
      Conditions : Etre connecté, être sur la page du tutoriel de l'auteur 
      Résultat attendu : Intéragir/contacter un auteur 

    UC20 - Répondre à un commentaire
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Répondre à un commentaire 
      Conditions : Etre connecté, être sur la page du tuto de l'auteur
      Résultat attendu : Poursuivre l'intéraction avec l'auteur, répondre à un commentaire d'un autre utilisateur. 

    UC21 - Intéraction avec un auteur via formulaire
      Acteur principal : Membre (Utilisateur connecté)
      objectif : Contacter un auteur en dehors des commentaires 
      Conditions : Etre connecté, être sur la page du tuto de l'auteur, utiliser le formulaire.
      Résultat attendu : Contacter/Echanger avec l'auteur en dehors des commentaires.

### Système de suivi

    UC22 - Suivre un profil
      Acteur principal: Membre (Utilisateur connecté)
      Objectif : Suivre des profils intéressants pour être notifié de leurs nouvelles compétences  
      Conditions : L'utilisateur est authentifié et consulte un profil qui ne fait pas partie de ses abonnements  
      Résultat attendu : Le suivi est établi, l'utilisateur recevra des notifications des nouveaux contenus de ce profil

    UC23 - Arrêter de suivre un profil
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Arrêter de suivre un profil pour nettoyer sa liste de suivi  
      Conditions : L'utilisateur est authentifié et suit déjà le profil concerné  
      Résultat attendu : Le suivi est supprimé, l'utilisateur ne recevra plus de notifications de ce profil

    UC24 - Voir qui me suit
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Connaître l'intérêt porté à son profil en consultant ses abonnés  
      Conditions : L'utilisateur est authentifié et accède à sa section "Abonnés"  
      Résultat attendu : La liste complète des utilisateurs qui suivent son profil est affichée

### Évaluations

    UC25 - Évaluer un auteur après échange
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Evaluer un auteur
      Conditions: L'utilisateur est authentifié et évalue l'auteur sur sa page auteur
      Résultat attendu : L'évaluation est visible sur le profil de l'auteur avec des étoiles

    UC26 - Évaluer un tutoriel
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Tutoriel consulté 
      Conditions: L'utilisateur est authentifié et évalue le tutoriel
      Résultat attendu : L'évaluation est visible sur le tutoriel avec un système de notation binaire (style youtube) 

    UC27 - Consulter les évaluations d'un profil 
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Consulter les évaluations d'un auteur
      Conditions: L'utilisateur est authentifié et accède au profil de l'auteur
      Résultat attendu : L'utilisateur peut juger de la fiabilité de l'auteur

    UC28 - Voir ses propres évaluations 
      Acteur principal : Membre (Utilisateur connecté)
      Objectif : Voir les évaluations de son propre profil
      Conditions: L'auteur va sur son profil
      Résultat attendu : L'auteur consulte ses notes et avis 

# MVP - v2

### Système de contact

    UC29 - Recevoir des demandes de contact
      Acteur principal : Membre  
      Objectif : Recevoir des demandes de contact pour pouvoir accepter ou refuser les échanges  
      Conditions : L'utilisateur est authentifié et d'autres utilisateurs connectés lui envoient des demandes de contact  
      Résultat attendu : Les demandes de contact sont reçues et affichées avec options d'acceptation ou de refus

    UC30 - Répondre aux demandes de contact
      Acteur principal : Membre  
      Objectif : Organiser les échanges en répondant aux demandes de contact reçues  
      Conditions : L'utilisateur est authentifié et a reçu au moins une demande de contact en attente  
      Résultat attendu : La réponse (acceptation ou refus) est envoyée et l'échange peut être organisé si acceptét

### Système de profil

    UC31 -  Mettre en pause son profil
      Acteur principal : Membre
      Objectif : 'Geler' sa page de profil afin de ne pas être référencé
      Conditions: Etre l'auteur d'un profil existant
      Résultat attendu: Rendre 'invisible' son profil de membre sur la plateforme