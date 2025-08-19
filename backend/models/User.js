import { DataTypes, Model, literal } from "sequelize";
import sequelize from '../config/database.js';


export class User extends Model {}

User.init({
    user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
    },
    last_name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    first_name: {
        type:DataTypes.STRING(50),
        allowNull: false
    },
    username: {
        type:DataTypes.STRING(25),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    birthdate: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    gender: {
        type: DataTypes.STRING(1),
        allowNull: true, 
        validate: {
            isIn: [['M', 'F', 'A']] 
        }
    },
    profile_picture: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal ('NOW()') //literal nous permet d'insérer du SQL brut 
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: literal ('NOW()') 
    }
},

{
        sequelize: sequelize, 
        tableName: 'user',
        timestamps: false //on gere manuellement created_at/updated_at avec NOW()
}

);












