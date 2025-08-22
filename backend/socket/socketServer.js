// Le point d' entree principale basique
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

/**
 * =====================================
 * SERVEUR WEBSOCKET - VERSION MINIMALE 
 * =====================================
 */

/**
 * Initialise le serveur WebSocket
 * @param {Object} httpServer - Serveur HTTP Express existant
 */
export const initializeSocket = (httpServer) => {
  console.log('Initialisation du serveur WebSocket...');

  // Créer le serveur Socket.io
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  // Middleware d'authentification JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token manquant'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.sub;
      socket.userEmail = decoded.email;
      
      console.log(`User ${socket.userId} authentifié`);
      next();
      
    } catch (error) {
      next(new Error('Token invalide'));
    }
  });

  // Gestion des connexions
  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connecté`);

    // Test de base
    socket.emit('welcome', { message: 'Connexion WebSocket réussie!' });

    // Déconnexion
    socket.on('disconnect', (reason) => {
      console.log(`User ${socket.userId} déconnecté: ${reason}`);
    });
  });

  console.log('Serveur WebSocket initialisé');
  
  return { io };
};