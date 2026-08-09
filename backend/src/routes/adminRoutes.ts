import { Router } from 'express';
import { getPricing, updatePricing, getGallery, createGalleryItem, deleteGalleryItem } from '../controllers/adminController';
import { authenticateUser } from '../middleware/security';

const router = Router();

// Middleware to check if user is admin
const adminOnly = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ status: 'error', message: 'Not authorized as an admin' });
  }
};

router.use(authenticateUser, adminOnly);

router.get('/pricing', getPricing);
router.post('/pricing', updatePricing);
router.get('/gallery', getGallery);
router.post('/gallery', createGalleryItem);
router.delete('/gallery/:id', deleteGalleryItem);

export default router;
