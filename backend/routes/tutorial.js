import express from 'express';
import { uploadImageTutorial } from '../config/multer.js';
import { Tutorial } from '../models/index.js';

const router = express.Router();

// Route POST /tutorials/:id/image
router.post('/:id/image', uploadImageTutorial.single('image'), async (req, res) => {
    console.log('Route image appelée', req.params.id, req.file);
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