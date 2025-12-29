import multer from 'multer';
import CloudinaryStorage from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

// ---------- Réglage tutoriel image ----------
// ---------- Réglage tutoriel image ----------
// UPDATE : Passage en memoryStorage pour upload manuel (plus fiable)
const tutorialStorage = multer.memoryStorage();
// const tutorialStorage = new CloudinaryStorage({
//   cloudinary,
//   params: (req, file) => ({
//     folder: 'skillshare/tutorials', // anciennement 'skillswap'
//     resource_type: 'image',
//     allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
//     // Conserve le format original et limite simplement la taille (pas de crop agressif)
//     transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
//   }),
// });

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
// Configurer le stockage en mémoire pour lister le buffer manuellement vers Cloudinary
const avatarStorage = multer.memoryStorage();

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
export default uploadImageTutorial;