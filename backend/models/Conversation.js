import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class Conversation extends Model {}

Conversation.init({
    // Clé primaire auto-incrémentée
    conversation_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    // Premier participant - TOUJOURS le plus petit ID
    // Cette contrainte évite les conversations dupliquées
    user1_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        }
    },
    
    // Deuxième participant - TOUJOURS le plus grand ID  
    user2_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user', 
            key: 'user_id'
        }
    },
    
    // Date de création de la conversation
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()')
    },
    
    // Timestamp du dernier message (pour tri par activité)
    // Mis à jour automatiquement à chaque nouveau message
    last_message_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()')
    }
}, {
    sequelize: sequelize,
    tableName: 'conversations',
    timestamps: false, // Gestion manuelle avec created_at/last_message_at
    
    // Index et contraintes pour performance et intégrité
    indexes: [
        {
            // Contrainte UNIQUE : une seule conversation par paire d'users
            unique: true,
            fields: ['user1_id', 'user2_id'],
            name: 'unique_conversation_pair'
        },
        {
            // Index pour rechercher conversations d'un user
            fields: ['user1_id']
        },
        {
            // Index pour rechercher conversations d'un user  
            fields: ['user2_id']
        },
        {
            // Index pour trier par activité récente
            fields: ['last_message_at']
        }
    ],
    
    // Validation métier
    validate: {
        // S'assurer que user1_id != user2_id (pas d'auto-conversation)
        differentUsers() {
            if (this.user1_id === this.user2_id) {
                throw new Error('Un utilisateur ne peut pas avoir une conversation avec lui-même');
            }
        },
        
        // S'assurer que user1_id < user2_id (ordre obligatoire)
        correctOrder() {
            if (this.user1_id >= this.user2_id) {
                throw new Error('user1_id doit être inférieur à user2_id pour éviter les doublons');
            }
        }
    }
});
