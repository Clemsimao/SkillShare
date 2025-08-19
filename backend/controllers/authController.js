// controllers/authController.js
import { authService } from '../services/authService.js';
import { User } from '../models/index.js'; 

// Inscription - VERSION VRAIE DB
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }
    
    // VÉRIFIER SI EMAIL EXISTE DÉJÀ
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }
    
    const hashedPassword = await authService.hashPassword(password);
    
    // VRAIE CRÉATION EN BASE
    const newUser = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });
    
    const token = authService.generateAccessToken(newUser);
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie !',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName
      },
      token
    });
    
  } catch (error) {
    console.error('❌ Erreur inscription:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de l\'inscription'
    });
  }
};

// Login - VERSION VRAIE DB  
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email et mot de passe requis'
      });
    }
    
    // VRAIE RECHERCHE EN BASE
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    const isPasswordValid = await authService.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect'
      });
    }
    
    const token = authService.generateAccessToken(user);
    
    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      token
    });
    
  } catch (error) {
    console.error('❌ Erreur connexion:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la connexion'
    });
  }
};

// getProfile
export const getProfile = async (req, res) => {
  try {
    // VRAIE RECHERCHE EN BASE
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] } // Exclure le mot de passe pour pas qu'il soit envoyé au front et donc qu'il ne soit pas visible
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      user
    });
    
  } catch (error) {
    console.error('❌ Erreur profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};