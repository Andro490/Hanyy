import { Router } from 'express';
import { getGallery } from '../controllers/adminController';

const router = Router();

// Public route to fetch gallery items
router.get('/', getGallery);

export default router;
