import { DataTypes, Model } from "sequelize";
import sequelize from '../config/database.js';

export class UserSkill extends Model {}

UserSkill.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize: sequelize,
    tableName: 'user_skills',
    timestamps: false
});

