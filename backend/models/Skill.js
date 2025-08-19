import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';

export class Skill extends Model {}

Skill.init({
    skill_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(80),
        allowNull: false
    },
    content: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize: sequelize,
    tableName: 'skill',
    timestamps: false
});

