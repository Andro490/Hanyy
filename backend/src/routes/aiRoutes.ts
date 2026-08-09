import { Router } from 'express';
import { generateAiImage } from '../controllers/aiController';

const router = Router();

// POST /api/ai/generate-image
router.post('/generate-image', generateAiImage);

export default router;
