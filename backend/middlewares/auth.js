import { authService } from '../services/authService.js';

// Middleware d'authentification obligatoire
export const authMiddleware = (req, res, next) => {
  try {
    // 1. Récupérer le header Authorization
    const authHeader = req.headers.authorization;
    
    // 2. Extraire le token
    const token = authService.extractToken(authHeader);
    
    // 3. Vérifier que le token existe
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token manquant. Accès refusé.'
      });
    }
    
    // 4. Vérifier la validité du token
    const decoded = authService.verifyToken(token);
    
    // 5. Ajouter les infos utilisateur à la requête
    req.user = {
      id: decoded.sub,     // sub = subject dans le standard JWT
      email: decoded.email
    };
    
    // 6. Passer au controller suivant
    next();
    
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré. Veuillez vous reconnecter.'
    });
  }
};

// Middleware optionnel (connecté OU pas)
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authService.extractToken(authHeader);
    
    if (!token) {
      req.user = null;
      return next();
    }
    
    const decoded = authService.verifyToken(token);
    req.user = {
      id: decoded.sub,
      email: decoded.email
    };
    
    next();
    
  } catch (error) {
    req.user = null;
    next();
  }
};