import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const authService = {
  
  // Hasher un mot de passe
  async hashPassword(password) {
    return await argon2.hash(password);
  },

  // Vérifier un mot de passe
  async verifyPassword(password, hash) {
    return await argon2.verify(hash, password);
  },

  // Créer un token JWT 
  generateAccessToken(data) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }
    
    return jwt.sign({
      sub: data.id,        // subject (utilisateur)
      email: data.email,   // info supplémentaire
      iss: 'skillswap-api' // issuer (qui émet le token)
    }, process.env.JWT_SECRET, { 
      expiresIn: '24h' 
    });
  },

  // Vérifier un token JWT
  verifyToken(token) {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not set');
    }
    return jwt.verify(token, process.env.JWT_SECRET);
  },

  // Extraire le token du header
  extractToken(authHeader) {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
};