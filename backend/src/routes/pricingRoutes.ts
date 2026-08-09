import { Router } from 'express';
import { calculatePrice } from '../controllers/pricingController';

const router = Router();

router.post('/calculate', calculatePrice);

export default router;
