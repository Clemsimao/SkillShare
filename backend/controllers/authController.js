// controllers/authController.js
import { authService } from '../services/authService.js';
import { User } from '../models/index.js';

// Inscription - VERSION VRAIE DB
export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, username, birthdate } = req.body;
    
    // ADAPTATION : Ajouter username et birthdate qui sont obligatoires
    if (!email || !password || !firstName || !lastName || !username || !birthdate) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (email, password, firstName, lastName, username, birthdate)'
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
    
    // VÉRIFIER SI USERNAME EXISTE DÉJÀ
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: 'Ce nom d\'utilisateur est déjà pris'
      });
    }
    
    const hashedPassword = await authService.hashPassword(password);
    
    // VRAIE CRÉATION EN BASE - ADAPTER AUX NOMS DE CHAMPS DU MODÈLE
    const newUser = await User.create({
      email,
      password: hashedPassword,
      first_name: firstName,    // ← Adapter au modèle
      last_name: lastName,      // ← Adapter au modèle
      username,
      birthdate
    });
    
    const token = authService.generateAccessToken({
      id: newUser.user_id,      // ← user_id au lieu de id
      email: newUser.email
    });
    
    res.status(201).json({
      success: true,
      message: 'Inscription réussie !',
      user: {
        id: newUser.user_id,         // ← user_id
        email: newUser.email,
        firstName: newUser.first_name, // ← first_name
        lastName: newUser.last_name,   // ← last_name
        username: newUser.username
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
    
    const token = authService.generateAccessToken({
      id: user.user_id,     // ← user_id
      email: user.email
    });
    
    res.status(200).json({
      success: true,
      message: 'Connexion réussie !',
      user: {
        id: user.user_id,           // ← user_id
        email: user.email,
        firstName: user.first_name, // ← first_name
        lastName: user.last_name,   // ← last_name
        username: user.username
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

// Déconnexion
export const logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Déconnexion réussie. Supprimez le token côté client.'
  });
};

// getProfile
export const getProfile = async (req, res) => {
  try {
    // VRAIE RECHERCHE EN BASE - Adapter à user_id
    const user = await User.findOne({ 
      where: { user_id: req.user.id },    // ← user_id au lieu de findByPk
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user.user_id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        birthdate: user.birthdate,
        gender: user.gender,
        profilePicture: user.profile_picture,
        createdAt: user.created_at,
        updatedAt: user.updated_at
      }
    });
    
  } catch (error) {
    console.error('❌ Erreur profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du profil'
    });
  }
};