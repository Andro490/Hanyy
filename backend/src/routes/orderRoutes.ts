import { Router } from 'express';
import { notifyOrder } from '../controllers/orderController';

const router = Router();

router.post('/notify', notifyOrder);

export default router;
