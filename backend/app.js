import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { sequelize } from './models/index.js';
import http from 'http'; // Module Node.js pour créer un serveur HTTP compatible avec Socket.io
import { initializeSocket } from './socket/socketServer.js';

import apiRoutes from './routes/index.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares de sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : 'http://localhost:3000',
  credentials: true
}));

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Initialisation de la base de données
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connexion DB réussie');
    
    await sequelize.sync({ force: false });
    console.log('Base de données synchronisée');
    
  } catch (error) {
    console.error('Erreur DB:', error.message);
    process.exit(1);
  }
}

// Routes API
app.use('/api', apiRoutes);


// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'SkillShare API - Backend opérationnel',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route non trouvée',
    data: null
  });
});

// Démarrage du serveur
async function startServer() {
  await initDatabase();

  // Créer le serveur HTTP (nécessaire pour Socket.io)
  const server = http.createServer(app);

  // Initialiser WebSocket avec socketServer.js
  const { io } = initializeSocket(server);
  
  server.listen(PORT, () => {
    console.log(`Serveur HTTP + WebSocket démarré sur le port ${PORT}`);
    console.log(`URL: http://localhost:${PORT}`);
  });
}

startServer();

export default app;