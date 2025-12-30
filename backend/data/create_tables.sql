-- =====================================================
-- MPD SKILLSHARE - Modèle Physique de Données
-- Base de données PostgreSQL + Sequelize ORM
-- Version MVP (Version 1)
-- =====================================================

-- -----------------------------------------------------
-- TABLE CATEGORY - Catégories de compétences
-- Entité indépendante, créée en premier
-- -----------------------------------------------------
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,           -- Clé primaire auto-incrémentée
    title VARCHAR(60) NOT NULL,               -- Nom de la catégorie
    content VARCHAR(255) NOT NULL             -- Description de la catégorie
);

-- -----------------------------------------------------
-- TABLE SKILL - Compétences disponibles
-- Dépend de CATEGORY (FK category_id)
-- -----------------------------------------------------
CREATE TABLE skill (
    skill_id SERIAL PRIMARY KEY,             -- Clé primaire auto-incrémentée
    title VARCHAR(80) NOT NULL,              -- Nom de la compétence
    content VARCHAR(255) NOT NULL,           -- Description détaillée de la compétence
    category_id INTEGER NOT NULL,            -- FK vers category - catégorie parente
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE -- CASCADE : supprime les skills si la catégorie est supprimée
);

-- -----------------------------------------------------
-- TABLE USER - Utilisateurs de la plateforme
-- Entité centrale du système, indépendante
-- -----------------------------------------------------
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,              -- Clé primaire auto-incrémentée
    last_name VARCHAR(50) NOT NULL,          -- Nom de famille obligatoire
    first_name VARCHAR(50) NOT NULL,         -- Prénom obligatoire
    username VARCHAR(25) UNIQUE NOT NULL,    -- Pseudo unique pour l'affichage public
    email VARCHAR(120) UNIQUE NOT NULL,      -- Email unique pour authentification
    password VARCHAR(255) NOT NULL,          -- Hash Argon2 (~97 chars, on prévoit large)
    birthdate DATE,                          -- Date de naissance (optionnelle)
    gender VARCHAR(1) CHECK (gender IN ('M', 'F', 'A')), -- M=Masculin, F=Féminin, A=Autre
    profile_picture VARCHAR(255),            -- URL/chemin vers photo de profil
    content VARCHAR(255), 
    location VARCHAR(100),                   -- Ville/Pays de l'utilisateur 
    created_at TIMESTAMP DEFAULT NOW(),      -- Date de création du compte
    updated_at TIMESTAMP DEFAULT NOW()       -- Dernière modification du profil
);

-- -----------------------------------------------------
-- TABLE TUTORIAL - Tutoriels créés par les utilisateurs
-- Dépend de USER (FK user_id) - chaque tutoriel a un auteur
-- -----------------------------------------------------
CREATE TABLE tutorial (
    tutorial_id SERIAL PRIMARY KEY,          -- Clé primaire auto-incrémentée
    title VARCHAR(120) NOT NULL,             -- Titre du tutoriel
    content TEXT,                            -- Contenu du tutoriel (texte long)
    picture VARCHAR(255),                    -- URL/chemin vers image d'illustration
    video_link VARCHAR(255),                 -- URL vers vidéo (YouTube, Vimeo, etc.)
    user_id INTEGER NOT NULL,                -- FK vers user - auteur du tutoriel
    created_at TIMESTAMP DEFAULT NOW(),      -- Date de création
    updated_at TIMESTAMP DEFAULT NOW(),      -- Dernière modification
    published_at TIMESTAMP DEFAULT NOW(),    -- Date de publication
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE -- CASCADE : supprime les tutoriels si l'utilisateur est supprimé
);

-- -----------------------------------------------------
-- TABLE COMMENTS - Commentaires sur les tutoriels
-- Dépend de USER et TUTORIAL (double FK)
-- Permet le contact via commentaires dans le MVP
-- -----------------------------------------------------
CREATE TABLE comments (
    comment_id SERIAL PRIMARY KEY,           -- Clé primaire auto-incrémentée
    content VARCHAR(500) NOT NULL,           -- Contenu du commentaire (limité à 500 chars)
    user_id INTEGER NOT NULL,                -- FK vers user - auteur du commentaire
    tutorial_id INTEGER NOT NULL,            -- FK vers tutorial - tutoriel commenté
    is_author BOOLEAN NOT NULL DEFAULT false, -- TRUE si l'auteur du tutoriel commente
    created_at TIMESTAMP DEFAULT NOW(),      -- Date de création
    updated_at TIMESTAMP DEFAULT NOW(),      -- Dernière modification
    published_at TIMESTAMP DEFAULT NOW(),    -- Date de publication
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tutorial_id) REFERENCES tutorial(tutorial_id) ON DELETE CASCADE -- CASCADE : supprime les commentaires si user ou tutorial supprimé
);

-- =====================================================
-- 2. TABLES D'ASSOCIATION (RELATIONS MANY-TO-MANY)
-- Créées après les entités principales
-- =====================================================

-- -----------------------------------------------------
-- USER_SKILLS - Compétences POSSÉDÉES par l'utilisateur
-- Relation M:N entre USER et SKILL
-- "Ce que je sais faire"
-- -----------------------------------------------------
CREATE TABLE user_skills (
    user_id INTEGER NOT NULL,                -- FK vers user
    skill_id INTEGER NOT NULL,               -- FK vers skill
    PRIMARY KEY (user_id, skill_id),         -- Clé primaire composite (évite les doublons)
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(skill_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- USER_INTERESTS - Compétences RECHERCHÉES par l'utilisateur
-- Relation M:N entre USER et SKILL
-- "Ce que je veux apprendre"
-- -----------------------------------------------------
CREATE TABLE user_interests (
    user_id INTEGER NOT NULL,                -- FK vers user
    skill_id INTEGER NOT NULL,               -- FK vers skill
    PRIMARY KEY (user_id, skill_id),         -- Clé primaire composite (évite les doublons)
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skill(skill_id) ON DELETE CASCADE
);

-- -----------------------------------------------------
-- USER_FOLLOWS - Système de suivi entre utilisateurs
-- Relation M:N réflexive sur USER
-- "Qui suit qui" - fonctionnalité sociale
-- -----------------------------------------------------
CREATE TABLE user_follows (
    follower_id INTEGER NOT NULL,      -- user qui suit
    followed_id INTEGER NOT NULL,      -- user suivi
    created_at TIMESTAMP DEFAULT NOW(),      
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (follower_id, followed_id),  -- Clé primaire composite (évite les doublons)
    FOREIGN KEY (follower_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (followed_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    CHECK (follower_id != followed_id)
);

-- -----------------------------------------------------
-- USER_RATINGS - Évaluations entre utilisateurs
-- Relation M:N entre USER et USER avec attribut rating
-- "Notes données après échange de compétences"
-- -----------------------------------------------------
CREATE TABLE user_ratings (
    evaluator_id INTEGER NOT NULL,
    evaluated_id INTEGER NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT NOW(),      
    updated_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (evaluator_id, evaluated_id), -- Clé primaire composite (évite les doublons)
    FOREIGN KEY (evaluator_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (evaluated_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    CHECK (evaluator_id != evaluated_id)
);

-- -----------------------------------------------------
-- TUTORIAL_RATINGS - Évaluations des tutoriels
-- Relation M:N entre USER et TUTORIAL avec attribut rating
-- "Notes données aux tutoriels"
-- -----------------------------------------------------
CREATE TABLE tutorial_ratings (
    user_id INTEGER NOT NULL,                
    tutorial_id INTEGER NOT NULL,            
    is_liked BOOLEAN NOT NULL,  -- TRUE = pouce en haut, FALSE = pouce en bas
    created_at TIMESTAMP DEFAULT NOW(),      
    updated_at TIMESTAMP DEFAULT NOW(),      
    PRIMARY KEY (user_id, tutorial_id),      
    FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE,
    FOREIGN KEY (tutorial_id) REFERENCES tutorial(tutorial_id) ON DELETE CASCADE
);
-- CONTRAINTE MÉTIER : Un auteur ne peut pas évaluer son propre tutoriel
-- À gérer côté application (backend), impossible en CHECK SQL

-- =====================================================
-- 3. INDEX DE PERFORMANCE
-- Optimisation des requêtes fréquentes
-- =====================================================

-- Index pour l'authentification (requêtes très fréquentes)
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_username ON "user"(username);

-- Index pour la recherche de compétences (fonctionnalité centrale)
CREATE INDEX idx_skill_category ON skill(category_id);
CREATE INDEX idx_skill_title ON skill(title);        -- Recherche par nom de compétence
