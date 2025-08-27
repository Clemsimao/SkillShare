import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class UserRating extends Model {}

UserRating.init({
    evaluator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    evaluated_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 5
        }
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
    tableName: 'user_ratings',
    timestamps: false
});

