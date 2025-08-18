// Configuration de la connexion a la base de donnees PostgreSQL avec Sequelize

import { Sequelize } from 'sequelize';

// Connexion a la base de donnees
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres', 
    logging: false // pour eviter les logs SQL dans la console
});

export default sequelize;


