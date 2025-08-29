import 'dotenv/config';


// NOTE:
// - This file uses ESM imports because your backend package.json has "type": "module".
// - Sequelize-CLI can still load it if pointed via --seeders-path and proper config.

const up = async (queryInterface, Sequelize) => {
  // 1. Catégories
  await queryInterface.bulkInsert('category', [
    { title: 'Programmation', content: 'Tout sur le développement informatique' },
    { title: 'Design', content: 'Graphisme et UX/UI' },
    { title: 'Langues', content: 'Apprentissage des langues étrangères' },
    { title: 'Musique', content: 'Instruments et théorie musicale' },
    { title: 'Cuisine', content: 'Recettes et techniques culinaires' }
  ]);

  // 2. Compétences
  await queryInterface.bulkInsert('skill', [
    { title: 'JavaScript', content: 'Langage de programmation web', category_id: 1 },
    { title: 'Photoshop', content: 'Retouche photo et création graphique', category_id: 2 },
    { title: 'Anglais', content: 'Langue internationale', category_id: 3 },
    { title: 'Guitare', content: 'Instrument à cordes', category_id: 4 },
    { title: 'Pâtisserie', content: 'Art de la pâtisserie', category_id: 5 }
  ]);

  // 3. Utilisateurs (avec hash déjà généré)
  const hash = '$argon2i$v=19$m=16,t=2,p=1$UmNNNXVXOW5mYVJLM2UwNw$KiXPKcImOA/q0tGNgBxTHQ';
  await queryInterface.bulkInsert('user', [
    { last_name: 'Doe', first_name: 'John', username: 'johndoe', email: 'john@example.com', password: hash, birthdate: '1990-01-01', gender: 'M', profile_picture: null },
    { last_name: 'Smith', first_name: 'Anna', username: 'annasmith', email: 'anna@example.com', password: hash, birthdate: '1992-05-12', gender: 'F', profile_picture: null },
    { last_name: 'Brown', first_name: 'Mike', username: 'mikebrown', email: 'mike@example.com', password: hash, birthdate: '1988-09-23', gender: 'M', profile_picture: null },
    { last_name: 'Lee', first_name: 'Sara', username: 'saralee', email: 'sara@example.com', password: hash, birthdate: '1995-03-17', gender: 'F', profile_picture: null },
    { last_name: 'Martin', first_name: 'Paul', username: 'paulmartin', email: 'paul@example.com', password: hash, birthdate: '1993-07-30', gender: 'M', profile_picture: null }
  ]);

  // 4. Tutoriels
  await queryInterface.bulkInsert('tutorial', [
    { title: 'Introduction à JS', content: 'Apprenez les bases de JavaScript.', picture: null, video_link: null, user_id: 1 },
    { title: 'Créer un logo avec Photoshop', content: 'Tutoriel pour débuter sur Photoshop.', picture: null, video_link: null, user_id: 2 },
    { title: 'Parler anglais couramment', content: 'Conseils pour améliorer son anglais.', picture: null, video_link: null, user_id: 3 },
    { title: 'Premiers accords à la guitare', content: 'Guide pour débutants en guitare.', picture: null, video_link: null, user_id: 4 },
    { title: 'Tarte au citron meringuée', content: 'Recette détaillée de la tarte au citron.', picture: null, video_link: null, user_id: 5 }
  ]);

  // 5. Commentaires
  await queryInterface.bulkInsert('comments', [
    { content: 'Super tutoriel !', user_id: 1, tutorial_id: 1, is_author: true },
    { content: 'Merci pour les astuces !', user_id: 2, tutorial_id: 2, is_author: true },
    { content: 'Très clair, bravo.', user_id: 3, tutorial_id: 3, is_author: true },
    { content: "J'ai appris beaucoup, merci.", user_id: 4, tutorial_id: 4, is_author: true },
    { content: 'Délicieux résultat !', user_id: 5, tutorial_id: 5, is_author: true }
  ]);

  // 6. user_skills
  await queryInterface.bulkInsert('user_skills', [
    { user_id: 1, skill_id: 1 },
    { user_id: 2, skill_id: 2 },
    { user_id: 3, skill_id: 3 },
    { user_id: 4, skill_id: 4 },
    { user_id: 5, skill_id: 5 }
  ]);

  // 7. user_interests
  await queryInterface.bulkInsert('user_interests', [
    { user_id: 1, skill_id: 2 },
    { user_id: 2, skill_id: 3 },
    { user_id: 3, skill_id: 4 },
    { user_id: 4, skill_id: 5 },
    { user_id: 5, skill_id: 1 }
  ]);

  // 8. user_follows
  await queryInterface.bulkInsert('user_follows', [
    { follower_id: 1, followed_id: 2 },
    { follower_id: 2, followed_id: 3 },
    { follower_id: 3, followed_id: 4 },
    { follower_id: 4, followed_id: 5 },
    { follower_id: 5, followed_id: 1 }
  ]);

  // 9. user_ratings
  await queryInterface.bulkInsert('user_ratings', [
    { evaluator_id: 1, evaluated_id: 2, rating: 5 },
    { evaluator_id: 2, evaluated_id: 3, rating: 4 },
    { evaluator_id: 3, evaluated_id: 4, rating: 5 },
    { evaluator_id: 4, evaluated_id: 5, rating: 3 },
    { evaluator_id: 5, evaluated_id: 1, rating: 4 }
  ]);

  // 10. tutorial_ratings
  await queryInterface.bulkInsert('tutorial_ratings', [
    { user_id: 1, tutorial_id: 1, is_liked: true },
    { user_id: 2, tutorial_id: 2, is_liked: true },
    { user_id: 3, tutorial_id: 3, is_liked: true },
    { user_id: 4, tutorial_id: 4, is_liked: false },
    { user_id: 5, tutorial_id: 5, is_liked: true }
  ]);
};

const down = async (queryInterface, Sequelize) => {
  await queryInterface.bulkDelete('tutorial_ratings', null, {});
  await queryInterface.bulkDelete('user_ratings', null, {});
  await queryInterface.bulkDelete('user_follows', null, {});
  await queryInterface.bulkDelete('user_interests', null, {});
  await queryInterface.bulkDelete('user_skills', null, {});
  await queryInterface.bulkDelete('comments', null, {});
  await queryInterface.bulkDelete('tutorial', null, {});
  await queryInterface.bulkDelete('user', null, {});
  await queryInterface.bulkDelete('skill', null, {});
  await queryInterface.bulkDelete('category', null, {});
};

export default { up, down };