import sequelize from '../config/database.js';
import { User } from './User.js';
import { Category } from './Category.js';
import { Skill } from './Skill.js';
import { Tutorial } from './Tutorial.js';
import { Comment } from './Comment.js';
import { UserSkill } from './UserSkill.js';
import { UserInterest } from './UserInterest.js';
import { UserFollow } from './UserFollow.js';
import { UserRating } from './UserRating.js';
import { TutorialRating } from './TutorialRating.js';
import { Conversation } from './Conversation.js';
import { Message } from './Message.js';

// =====================================================
// ASSOCIATIONS - Relations entre les modèles
// =====================================================

// -----------------------------------------------
// 1. RELATIONS ONE-TO-MANY (1:N)
// -----------------------------------------------

// Category -> Skill (une catégorie a plusieurs compétences)
Category.hasMany(Skill, {
    foreignKey: 'category_id',
    as: 'skills'
});
Skill.belongsTo(Category, {
    foreignKey: 'category_id',
    as: 'category'
});

// User -> Tutorial (un utilisateur a plusieurs tutoriels)
// CASCADE DELETE : supprime tutoriels quand user supprimé
User.hasMany(Tutorial, {
    foreignKey: 'user_id',
    as: 'tutorials',
    onDelete: 'CASCADE' 
});
Tutorial.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author'
});

// User -> Comment (un utilisateur peut faire plusieurs commentaires)
// CASCADE DELETE : supprime commentaires quand user supprimé
User.hasMany(Comment, {
    foreignKey: 'user_id',
    as: 'comments', 
    onDelete: 'CASCADE'
});
Comment.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'author'
});

// Tutorial -> Comment (un tutoriel peut avoir plusieurs commentaires)
// CASCADE DELETE : supprime commentaires quand tutorial supprimé
Tutorial.hasMany(Comment, {
    foreignKey: 'tutorial_id',
    as: 'comments', 
    onDelete: 'CASCADE' 
});
Comment.belongsTo(Tutorial, {
    foreignKey: 'tutorial_id',
    as: 'tutorial'
});

// -----------------------------------------------
// 2. RELATIONS MANY-TO-MANY (N:N)
// -----------------------------------------------

// User <-> Skill (compétences possédées) via user_skills
User.belongsToMany(Skill, {
    through: UserSkill,
    foreignKey: 'user_id',
    otherKey: 'skill_id',
    as: 'skills'
});
Skill.belongsToMany(User, {
    through: UserSkill,
    foreignKey: 'skill_id',
    otherKey: 'user_id',
    as: 'users'
});

// User <-> Skill (intérêts) via user_interests
User.belongsToMany(Skill, {
    through: UserInterest,
    foreignKey: 'user_id',
    otherKey: 'skill_id',
    as: 'interests'
});
Skill.belongsToMany(User, {
    through: UserInterest,
    foreignKey: 'skill_id',
    otherKey: 'user_id',
    as: 'interestedUsers'
});

// User <-> User (suivis) via user_follows
User.belongsToMany(User, {
    through: UserFollow,
    foreignKey: 'follower_id',
    otherKey: 'followed_id',
    as: 'following'
});
User.belongsToMany(User, {
    through: UserFollow,
    foreignKey: 'followed_id',
    otherKey: 'follower_id',
    as: 'followers'
});

// User <-> User (évaluations) via user_ratings
User.belongsToMany(User, {
    through: UserRating,
    foreignKey: 'evaluator_id',
    otherKey: 'evaluated_id',
    as: 'evaluatedUsers'
});
User.belongsToMany(User, {
    through: UserRating,
    foreignKey: 'evaluated_id',
    otherKey: 'evaluator_id',
    as: 'evaluators'
});

// User <-> Tutorial (évaluations tutoriels) via tutorial_ratings
User.belongsToMany(Tutorial, {
    through: TutorialRating,
    foreignKey: 'user_id',
    otherKey: 'tutorial_id',
    as: 'ratedTutorials'
});
Tutorial.belongsToMany(User, {
    through: TutorialRating,
    foreignKey: 'tutorial_id',
    otherKey: 'user_id',
    as: 'raters'
});


// -----------------------------------------------
// 3. RELATIONS MESSAGERIE INSTANTANÉE
// -----------------------------------------------

// User -> Conversation (participant 1) - un user peut être user1 dans plusieurs conversations
User.hasMany(Conversation, {
    foreignKey: 'user1_id',
    as: 'conversationsAsUser1',
    onDelete: 'CASCADE'
});
Conversation.belongsTo(User, {
    foreignKey: 'user1_id', 
    as: 'participant1'
});

// User -> Conversation (participant 2) - un user peut être user2 dans plusieurs conversations  
User.hasMany(Conversation, {
    foreignKey: 'user2_id',
    as: 'conversationsAsUser2',
    onDelete: 'CASCADE'
});
Conversation.belongsTo(User, {
    foreignKey: 'user2_id',
    as: 'participant2'
});

// Conversation -> Message (une conversation a plusieurs messages)
// CASCADE DELETE : supprime messages quand conversation supprimée
Conversation.hasMany(Message, {
    foreignKey: 'conversation_id',
    as: 'messages',
    onDelete: 'CASCADE'
});
Message.belongsTo(Conversation, {
    foreignKey: 'conversation_id',
    as: 'conversation'
});

// User -> Message (un utilisateur peut envoyer plusieurs messages)
// CASCADE DELETE : supprime messages quand user supprimé
User.hasMany(Message, {
    foreignKey: 'sender_id', 
    as: 'sentMessages',
    onDelete: 'CASCADE'
});
Message.belongsTo(User, {
    foreignKey: 'sender_id',
    as: 'sender'
});

export {
    sequelize,
    User,
    Category,
    Skill,
    Tutorial,
    Comment,
    UserSkill,
    UserInterest,
    UserFollow,
    UserRating,
    TutorialRating,
    Conversation, 
    Message    
};