import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class TutorialRating extends Model {}

TutorialRating.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    tutorial_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    is_liked: {
        type: DataTypes.BOOLEAN,
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
    }
}, {
    sequelize: sequelize,
    tableName: 'tutorial_ratings',
    timestamps: false
});

