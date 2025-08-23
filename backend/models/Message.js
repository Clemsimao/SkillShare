import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class Message extends Model {}

Message.init({
    // Clé primaire auto-incrémentée
    message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    
    // FK vers la conversation parente
    conversation_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'conversations',
            key: 'conversation_id'
        }
    },
    
    // FK vers l'utilisateur expéditeur
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'user',
            key: 'user_id'
        }
    },
    
    // Contenu du message - limité à 1000 caractères - A CONFIRMER EN EQUIPE
    content: {
        type: DataTypes.STRING(1000),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Le message ne peut pas être vide'
            },
            len: {
                args: [1, 1000],
                msg: 'Le message doit contenir entre 1 et 1000 caractères'
            }
        }
    },
    
    // Timestamp d'envoi du message
    sent_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()')
    },
    
    // Statut de lecture - false par défaut (nouveau message non lu)
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize: sequelize,
    tableName: 'messages',
    timestamps: false, // Gestion manuelle avec sent_at
    
    // Index pour performance des requêtes fréquentes
    indexes: [
        {
            // Index pour récupérer messages d'une conversation
            fields: ['conversation_id']
        },
        {
            // Index pour récupérer messages d'un expéditeur
            fields: ['sender_id']
        },
        {
            // Index pour trier par date d'envoi (chronologique)
            fields: ['sent_at']
        },
        {
            // Index pour compter messages non lus
            fields: ['is_read']
        },
        {
            // Index composite pour messages non lus d'une conversation
            fields: ['conversation_id', 'is_read']
        }
    ]
});

// =====================================================
// MODÈLE SIMPLE - STRUCTURE UNIQUEMENT
// La logique métier sera dans messageService.js
// =====================================================