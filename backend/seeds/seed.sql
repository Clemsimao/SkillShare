-- SEED : Ajout de 5 exemples par table principale et d'association

-- 1. Catégorie
INSERT INTO category (title, content) VALUES 
('Programmation', 'Tout sur le développement informatique'),
('Design', 'Graphisme et UX/UI'),
('Langues', 'Apprentissage des langues étrangères'),
('Musique', 'Instruments et théorie musicale'),
('Cuisine', 'Recettes et techniques culinaires');

-- 2. Compétence
INSERT INTO skill (title, content, category_id) VALUES 
('JavaScript', 'Langage de programmation web', 1),
('Photoshop', 'Retouche photo et création graphique', 2),
('Anglais', 'Langue internationale', 3),
('Guitare', 'Instrument à cordes', 4),
('Pâtisserie', 'Art de la pâtisserie', 5);

-- 3. Utilisateur
INSERT INTO "user" (last_name, first_name, username, email, password, birthdate, gender, profile_picture) VALUES 
('Doe', 'John', 'johndoe', 'john@example.com', 'hashedpassword', '1990-01-01', 'M', NULL),
('Smith', 'Anna', 'annasmith', 'anna@example.com', 'hashedpassword', '1992-05-12', 'F', NULL),
('Brown', 'Mike', 'mikebrown', 'mike@example.com', 'hashedpassword', '1988-09-23', 'M', NULL),
('Lee', 'Sara', 'saralee', 'sara@example.com', 'hashedpassword', '1995-03-17', 'F', NULL),
('Martin', 'Paul', 'paulmartin', 'paul@example.com', 'hashedpassword', '1993-07-30', 'M', NULL);

-- 4. Tutoriel
INSERT INTO tutorial (title, content, picture, video_link, user_id) VALUES 
('Introduction à JS', 'Apprenez les bases de JavaScript.', NULL, NULL, 1),
('Créer un logo avec Photoshop', 'Tutoriel pour débuter sur Photoshop.', NULL, NULL, 2),
('Parler anglais couramment', 'Conseils pour améliorer son anglais.', NULL, NULL, 3),
('Premiers accords à la guitare', 'Guide pour débutants en guitare.', NULL, NULL, 4),
('Tarte au citron meringuée', 'Recette détaillée de la tarte au citron.', NULL, NULL, 5);

-- 5. Commentaire (avec is_author = true car chaque auteur commente son propre tuto)
INSERT INTO comments (content, user_id, tutorial_id, is_author) VALUES 
('Super tutoriel !', 1, 1, true),
('Merci pour les astuces !', 2, 2, true),
('Très clair, bravo.', 3, 3, true),
('J''ai appris beaucoup, merci.', 4, 4, true),
('Délicieux résultat !', 5, 5, true);

-- 6. user_skills
INSERT INTO user_skills (user_id, skill_id) VALUES 
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- 7. user_interests
INSERT INTO user_interests (user_id, skill_id) VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

-- 8. user_follows
INSERT INTO user_follows (follower_id, followed_id) VALUES 
(1, 2),
(2, 3),
(3, 4),
(4, 5),
(5, 1);

-- 9. user_ratings
INSERT INTO user_ratings (evaluator_id, evaluated_id, rating) VALUES 
(1, 2, 5),
(2, 3, 4),
(3, 4, 5),
(4, 5, 3),
(5, 1, 4);

-- 10. tutorial_ratings
INSERT INTO tutorial_ratings (user_id, tutorial_id, is_liked) VALUES 
(1, 1, TRUE),
(2, 2, TRUE),
(3, 3, TRUE),
(4, 4, FALSE),
(5, 5, TRUE);