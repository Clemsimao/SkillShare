import { DataTypes, Model } from "sequelize";
import sequelize from '../config/database.js';

export class UserInterest extends Model {}

UserInterest.init({
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
    tableName: 'user_interests',
    timestamps: false
});

