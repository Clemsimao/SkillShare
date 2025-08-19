import { DataTypes, Model, } from "sequelize";
import sequelize from '../config/database.js';

export class Category extends Model {}

Category.init({
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(60),
    allowNull: false
  },
  content: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
},
{
  sequelize: sequelize,
  tableName: 'category',
  timestamps: false // pas de created_at/updated_at dans notre MPD
}
);

