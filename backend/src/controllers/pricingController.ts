import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import prisma from '../config/db';

// Schema for validating dynamic pricing input
const pricingQuerySchema = z.object({
    width: z.number().min(1, 'Width must be at least 1cm').max(50, 'Width cannot exceed 50cm'),
    height: z.number().min(1, 'Height must be at least 1cm').max(50, 'Height cannot exceed 50cm'),
    material: z.enum(['GOLD', 'SILVER']),
});

export const calculatePrice = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const parsed = pricingQuerySchema.parse(req.body);
        const { width, height, material } = parsed;

        const pricingVariables = await prisma.pricingVariables.findFirst();
        if (!pricingVariables) {
            res.status(500).json({ status: 'error', message: 'Pricing variables not configured' });
            return;
        }

        const area = width * height;
        const basePrice = material === 'GOLD' ? pricingVariables.baseGoldPrice : pricingVariables.baseSilverPrice;
        const calculatedPrice = area * basePrice * pricingVariables.manufacturingFee;

        res.status(200).json({
            status: 'success',
            data: { width, height, material, area, price: parseFloat(calculatedPrice.toFixed(2)) },
        });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ status: 'error', message: (error as any).errors });
            return;
        }
        next(error);
    }
};
