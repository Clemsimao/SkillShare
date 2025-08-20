# Tutoriel : Intégrer Cloudinary pour l’upload d’images sur les tutoriels

Ce guide explique comment configurer Cloudinary dans ton backend Node.js pour permettre l’upload d’images sur les tutoriels, avec Sequelize et Express.

---

## 1. Installer les dépendances

Dans le dossier `backend`, lance :
```bash
npm install cloudinary multer multer-storage-cloudinary dotenv
```

---

## 2. Configurer Cloudinary

Crée le fichier `backend/config/cloudinary.js` :
```javascript
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
```

Ajoute les variables dans `.env` :
```
CLOUDINARY_CLOUD_NAME=ton_nom_cloud
CLOUDINARY_API_KEY=ta_cle_api
CLOUDINARY_API_SECRET=ton_secret_api
```

---

## 3. Configurer Multer pour Cloudinary

Crée le fichier `backend/config/multer.js` :
```javascript
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'skillswap', // nom du dossier Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
    transformation: [{ width: 800, height: 800, crop: 'limit' }],
  },
});

const upload = multer({ storage });
export default upload;
```

---

## 4. Adapter le modèle Tutorial

Dans ton modèle Sequelize `Tutorial`, ajoute un champ pour l’URL de l’image :
```javascript
// ...existing code...
image_url: {
  type: DataTypes.STRING,
  allowNull: true,
},
// ...existing code...
```

Vérifie aussi que ta table SQL possède ce champ.

---

## 5. Créer la route Express pour l’upload d’image sur un tutoriel

Dans ton routeur (ex : `backend/routes/tutorialRoutes.js`) :
```javascript
import express from 'express';
import upload from '../config/multer.js';
import { Tutorial } from '../models/index.js';

const router = express.Router();

// Route POST /tutorials/:id/image
router.post('/tutorials/:id/image', upload.single('image'), async (req, res) => {
  try {
    const tutorialId = req.params.id;
    const imageUrl = req.file.path; // URL Cloudinary

    // Met à jour le tutoriel avec l’URL de l’image
    await Tutorial.update(
      { image_url: imageUrl },
      { where: { tutorial_id: tutorialId } }
    );

    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur upload image' });
  }
});

export default router;
```

---

## 6. Utilisation côté frontend

- Envoie l’image via un formulaire `multipart/form-data` avec le champ `image`.
- Exemple avec fetch :
```js
const formData = new FormData();
formData.append('image', fileInput.files[0]);
fetch('/api/tutorials/123/image', {
  method: 'POST',
  body: formData,
});
```

---

## 7. Bonnes pratiques

- Valide le format et la taille côté frontend et backend.
- Stocke uniquement l’URL Cloudinary dans la BDD.
- Ne mets jamais tes credentials Cloudinary en dur dans le code.
- Utilise le champ `image_url` pour afficher l’image dans tes pages tutoriel.

---

## 8. Exemple de réponse API

```json
{
  "success": true,
  "imageUrl": "https://res.cloudinary.com/ton_nom_cloud/image/upload/v.../skillswap/nom_image.jpg"
}
```

---





