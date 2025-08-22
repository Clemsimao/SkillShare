import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

// ---------- Réglage tutoriel image ----------
const tutorialStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'skillshare/tutorials', // anciennement 'skillswap'
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Conserve le format original et limite simplement la taille (pas de crop agressif)
    transformation: [ { width: 1600, height: 1600, crop: 'limit' } ],
  }),
});

const uploadImageTutorial = multer({
  storage: tutorialStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max pour des visuels de tuto
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Type de fichier non supporté (jpeg/png/webp)'));
  }
});

// ---------- Réglage image de profil user ----------
const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'skillshare/avatars',
    resource_type: 'image',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [ { width: 512, height: 512, crop: 'fill', gravity: 'face' } ],
    format: 'webp', // sortie plus légère
  }),
});

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Type de fichier non supporté (jpeg/png/webp)'));
  }
});

export { uploadImageTutorial, uploadAvatar };
