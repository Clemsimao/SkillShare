import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class UserFollow extends Model {}

UserFollow.init({
    follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    followed_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
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
    tableName: 'user_follows',
    timestamps: false
});

