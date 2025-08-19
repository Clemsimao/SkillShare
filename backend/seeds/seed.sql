-- SEED : Ajout d'un élément par table principale et d'association

-- 1. Catégorie
INSERT INTO category (title, content) VALUES ('Programmation', 'Tout sur le développement informatique');

-- 2. Compétence
INSERT INTO skill (title, content, category_id) VALUES ('JavaScript', 'Langage de programmation web', 1);

-- 3. Utilisateur
INSERT INTO "user" (last_name, first_name, username, email, password, birthdate, gender, profile_picture) VALUES ('Doe', 'John', 'johndoe', 'john@example.com', 'hashedpassword', '1990-01-01', 'M', '');

-- 4. Tutoriel
INSERT INTO tutorial (title, content, picture, video_link, user_id) VALUES ('Introduction à JS', 'Apprenez les bases de JavaScript.', '', '', 1);

-- 5. Commentaire
INSERT INTO comments (content, user_id, tutorial_id) VALUES ('Super tutoriel !', 1, 1);

-- 6. user_skills
INSERT INTO user_skills (user_id, skill_id) VALUES (1, 1);

-- 7. user_interests
INSERT INTO user_interests (user_id, skill_id) VALUES (1, 1);

-- 8. user_follows
INSERT INTO user_follows (follower_id, followed_id) VALUES (1, 1);

-- 9. user_ratings
INSERT INTO user_ratings (evaluator_id, evaluated_id, rating) VALUES (1, 1, 5);

-- 10. tutorial_ratings
INSERT INTO tutorial_ratings (user_id, tutorial_id, is_liked) VALUES (1, 1, TRUE);
