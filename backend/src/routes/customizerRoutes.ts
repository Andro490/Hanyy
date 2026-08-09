import { Router } from 'express';
import { getTemplates, saveDesign, aiGenerate, getUserDesigns } from '../controllers/customizerController';
import { authenticateUser, securityRateLimiter } from '../middleware/security';

const router = Router();

// Public: Browse templates
router.get('/templates', getTemplates);

// Protected: Save a design (must be logged in)
router.post('/designs', authenticateUser, saveDesign);

// Protected + Rate-limited: AI generation
router.post('/ai-generate', authenticateUser, securityRateLimiter, aiGenerate);

// Protected: Get user's saved designs
router.get('/my-designs', authenticateUser, getUserDesigns);

export default router;
