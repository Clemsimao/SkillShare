import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class Comment extends Model {}

Comment.init({
    comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    tutorial_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()')
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()')
    },
    published_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal('NOW()')
    }
}, {
    sequelize: sequelize,
    tableName: 'comments',
    timestamps: false
});

